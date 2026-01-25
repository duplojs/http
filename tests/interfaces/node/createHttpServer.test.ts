import { createHub, type Hub, type HttpServerParams } from "@core";
import { implementHttpServer } from "@core/implementHttpServer";
import { type AnyFunction } from "@duplojs/utils";
import { testHub } from "@test-utils/hub";
import { createFakeRequest } from "@test-utils/request";

const createMockServer = () => {
	const handlers = new Map<string, AnyFunction>();
	const self = {
		addListener: vi.fn((event, handler) => {
			handlers.set(event, handler);
			return self;
		}),
		emit: (event: string, ...args: any[]) => handlers.get(event)?.(...args),
		handlers,
		listen: vi.fn((__, callback) => callback()),
	};
	return self;
};

const mockHttpServer = createMockServer();
const mockHttpsServer = createMockServer();
const httpCreateServer = vi.fn(() => mockHttpServer);
const httpsCreateServer = vi.fn(() => mockHttpsServer);

vi.mock("http", () => ({
	default: { createServer: httpCreateServer },
	createServer: httpCreateServer,
}));

vi.mock("https", () => ({
	default: { createServer: httpsCreateServer },
	createServer: httpsCreateServer,
}));

vi.mock("@core/implementHttpServer", () => ({
	implementHttpServer: vi.fn(),
}));

const { createHttpServer } = await import("@interface-node");

describe("createHttpServer", () => {
	beforeEach(() => {
		vi.mocked(implementHttpServer).mockReset();
		httpCreateServer.mockClear();
		httpsCreateServer.mockClear();
		mockHttpServer.handlers.clear();
		mockHttpsServer.handlers.clear();
	});

	it("wires HTTP server request handler and passes params to implementHttpServer", async() => {
		const execRouteSystem = vi.fn().mockResolvedValue(undefined);
		let receivedHub = undefined as Hub | undefined;
		let receivedHttpServerParams = undefined as HttpServerParams | undefined;

		vi.mocked(implementHttpServer).mockImplementation(
			async({ hub, httpServerParams }, initHttpServer) => {
				receivedHub = hub;
				receivedHttpServerParams = httpServerParams;
				return await initHttpServer({
					execRouteSystem,
					httpServerParams,
				});
			},
		);

		const baseHub = createHub({ environment: "DEV" });
		const server = await createHttpServer(
			baseHub,
			{
				host: "localhost",
				port: 3000,
			},
		);

		expect(receivedHub?.hooksRouteLifeCycle.length).toBe(
			baseHub.hooksRouteLifeCycle.length + 1,
		);
		expect(receivedHttpServerParams).toStrictEqual({
			host: "localhost",
			port: 3000,
			maxBodySize: "50mb",
			informationHeaderKey: "information",
			predictedHeaderKey: "predicted",
			fromHookHeaderKey: "from-hook",
			interface: "node",
		});
		expect(httpCreateServer).toHaveBeenCalledWith({});
		expect(httpsCreateServer).not.toHaveBeenCalled();
		expect(server).toBe(mockHttpServer);

		const { raw: { request, response } } = createFakeRequest({
			raw: {
				request: {
					method: "GET",
					url: "/test",
					headers: {
						host: "example.com",
						origin: "https://example.com",
					},
				},
			},
		});

		await mockHttpServer.handlers.get("request")!(request, response);

		expect(execRouteSystem).toHaveBeenCalledWith(
			{
				method: "GET",
				headers: request.headers,
				host: "example.com",
				origin: "https://example.com",
				url: "/test",
				raw: {
					request,
					response,
				},
			},
			expect.any(Function),
		);
	});

	it("chooses HTTPS server when https options provided", async() => {
		vi.mocked(implementHttpServer).mockImplementation(
			async({ httpServerParams }, initHttpServer) => await initHttpServer({
				execRouteSystem: vi.fn(),
				httpServerParams,
			}),
		);

		const server = await createHttpServer(testHub, {
			host: "localhost",
			port: 3000,
			https: { key: "k" as any },
		});

		expect(httpsCreateServer).toHaveBeenCalledWith({ key: "k" });
		expect(httpCreateServer).not.toHaveBeenCalled();
		expect(server).toBe(mockHttpsServer);
	});

	it("uses whenUncaughtError to send fallback response", async() => {
		vi.mocked(implementHttpServer).mockImplementation(
			async({ httpServerParams }, initHttpServer) => await initHttpServer({
				execRouteSystem: async(routerInitializationData, whenUncaughtError) => {
					await whenUncaughtError(
						{ toString: () => {} },
						routerInitializationData,
					);
				},
				httpServerParams,
			}),
		);

		await createHttpServer(
			testHub,
			{
				host: "localhost",
				port: 3000,
			},
		);

		const { raw: { request, response } } = createFakeRequest({
			raw: {
				request: {
					method: "GET",
					url: "/error",
				},
			},
		});

		await mockHttpServer.handlers.get("request")!(request, response);

		expect(response._getStatusCode()).toBe(500);
		expect(response._getHeaders()).toStrictEqual({ information: "critical-server-error" });
		expect(response._getData()).toBe("unknown-server-error");
		expect(response._isEndCalled()).toBe(true);
	});

	it("uses whenUncaughtError on error to send fallback response", async() => {
		vi.mocked(implementHttpServer).mockImplementation(
			async({ httpServerParams }, initHttpServer) => await initHttpServer({
				execRouteSystem: async(routerInitializationData, whenUncaughtError) => {
					await whenUncaughtError(
						new Error("Test."),
						routerInitializationData,
					);
				},
				httpServerParams,
			}),
		);

		await createHttpServer(
			testHub,
			{
				host: "localhost",
				port: 3000,
			},
		);

		const { raw: { request, response } } = createFakeRequest({
			raw: {
				request: {
					method: "GET",
					url: "/error",
				},
			},
		});

		await mockHttpServer.handlers.get("request")!(request, response);

		expect(response._getStatusCode()).toBe(500);
		expect(response._getData()).toBe("Error: Test.");
	});

	it("already treat response before uncaught error", async() => {
		vi.mocked(implementHttpServer).mockImplementation(
			async({ httpServerParams }, initHttpServer) => await initHttpServer({
				execRouteSystem: async(routerInitializationData, whenUncaughtError) => {
					routerInitializationData.raw.response.writeHead(2020);
					routerInitializationData.raw.response.end();

					await whenUncaughtError(
						undefined,
						routerInitializationData,
					);
				},
				httpServerParams,
			}),
		);

		await createHttpServer(
			testHub,
			{
				host: "localhost",
				port: 3000,
			},
		);

		const { raw: { request, response } } = createFakeRequest();

		request.method = undefined;
		request.url = undefined;

		await mockHttpServer.handlers.get("request")!(request, response);

		expect(response._getStatusCode()).toBe(2020);
	});
});
