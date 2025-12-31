import { ResponseContract, serverErrorExitHookFunction, serverErrorNextHookFunction, useRouteBuilder } from "@core";
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

const { createHttpServer } = await import("@interface-node");

describe("createHttpServer", () => {
	beforeEach(() => {
		httpCreateServer.mockClear();
		httpsCreateServer.mockClear();
		mockHttpServer.handlers.clear();
		mockHttpsServer.handlers.clear();
	});

	it("builds router and wires HTTP server request handler", async() => {
		const routeHandler = vi.fn();
		const route = useRouteBuilder("GET", "/")
			.handler(
				ResponseContract.noContent("ok"),
				(floor, { response }) => {
					routeHandler();
					return response("ok");
				},
			);

		const beforeServerBuildRouteHook = vi.fn();
		const afterStartServerHook = vi.fn();
		const beforeStartServerHook = vi.fn();

		const server = await createHttpServer(
			testHub
				.addHubHooks({
					beforeServerBuildRoute: beforeServerBuildRouteHook,
					afterStartServer: afterStartServerHook,
					beforeStartServer: beforeStartServerHook,
				})
				.register(route),
			{
				host: "localhost",
				port: 3000,
			},
		);

		expect(httpCreateServer).toHaveBeenCalledWith({});
		expect(httpsCreateServer).not.toHaveBeenCalled();
		expect(server).toBe(mockHttpServer);
		expect(beforeServerBuildRouteHook).toHaveBeenCalledOnce();
		expect(afterStartServerHook).toHaveBeenCalledOnce();
		expect(beforeStartServerHook).toHaveBeenCalledOnce();

		const { raw: { request, response } } = createFakeRequest({
			raw: {
				request: {
					method: "GET",
					url: "/",
				},
			},
		});

		await mockHttpServer.handlers.get("request")!(request, response);

		expect(routeHandler).toHaveBeenCalledOnce();
		expect(response._getHeaders()).toStrictEqual({ information: "ok" });
	});

	it("chooses HTTPS server when https options provided", async() => {
		const server = await createHttpServer(testHub, {
			host: "localhost",
			port: 3000,
			https: { key: "k" as any },
		});

		expect(httpsCreateServer).toHaveBeenCalledWith({ key: "k" });
		expect(httpCreateServer).not.toHaveBeenCalled();
		expect(server).toBe(mockHttpsServer);

		const { raw: { request, response } } = createFakeRequest();

		await mockHttpsServer.handlers.get("request")!({
			...request,
			method: undefined,
			url: undefined,
		}, response);

		expect(response._getStatusCode()).toBe(404);
		expect(response._getHeaders()).toStrictEqual({
			"content-type": "text/plain; charset=utf-8",
			information: "notfound-route",
		});
	});

	describe("handler error", () => {
		const route = useRouteBuilder("GET", "/error", {
			hooks: [
				{
					beforeSendResponse: () => {
						throw { toString: () => {} } as any;
					},
				},
			],
		})
			.handler(
				ResponseContract.noContent("ok"),
				(floor, { response }) => response("ok"),
			);

		it("handles router rejection: calls whenServerError and sends fallback 500", async() => {
			const whenServerError = vi.fn();
			await createHttpServer(
				testHub
					.register(route)
					.addHubHooks({
						serverError: whenServerError,
					}),
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
			expect(whenServerError).toHaveBeenCalledWith({
				serverRequest: request,
				serverResponse: response,
				error: expect.any(Object),
				exit: serverErrorExitHookFunction,
				next: serverErrorNextHookFunction,
			});
			expect(response._getStatusCode()).toBe(500);
			expect(response._getHeaders()).toStrictEqual({ information: "critical-server-error" });
			expect(response._getData()).toBe("unknown-server-error");
			expect(response._isEndCalled()).toBe(true);
		});

		it("handles router rejection: calls whenServerError and", async() => {
			await createHttpServer(
				testHub
					.register(route)
					.addHubHooks({
						serverError: ({ serverResponse, exit }) => {
							serverResponse.writeHead(200, { ok: "boomer" });
							serverResponse.write("test");
							serverResponse.end();

							return exit();
						},
					}),
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
			expect(response._getStatusCode()).toBe(200);
			expect(response._getHeaders()).toStrictEqual({ ok: "boomer" });
			expect(response._getData()).toBe("test");
			expect(response._isEndCalled()).toBe(true);
		});
	});
});
