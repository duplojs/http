import { type HttpServerParams, ResponseContract, type RouterParams, TextBodyController, createHub, implementHttpServer, serverErrorExitHookFunction, serverErrorNextHookFunction, useRouteBuilder } from "@core";
import { E, type AnyFunction } from "@duplojs/utils";

describe("implementHttpServer", () => {
	const bodyReaderImplementation = TextBodyController.createReaderImplementation(
		() => Promise.resolve(E.success(undefined)),
	);
	it("runs lifecycle hooks in order and executes route", async() => {
		const calls: string[] = [];
		const routeHandler = vi.fn();
		const httpServerParams = {} as HttpServerParams;

		const route = useRouteBuilder("GET", "/")
			.handler(
				ResponseContract.noContent("ok"),
				(floor, { response }) => {
					routeHandler();
					return response("ok");
				},
			);

		const beforeServerBuildRoutesHook = vi.fn((hub, params) => {
			calls.push("beforeServerBuildRoutes");
			expect(params).toBe(httpServerParams);
			return hub;
		});
		const beforeStartServerHook = vi.fn((hub, params) => {
			calls.push("beforeStartServer");
			expect(params).toBe(httpServerParams);
			return hub;
		});
		const afterStartServerHook = vi.fn((hub, params) => {
			calls.push("afterStartServer");
			expect(params).toBe(httpServerParams);
			return hub;
		});

		const server = { id: "server" };
		const hub = createHub({ environment: "DEV" })
			.register(route)
			.addHubHooks({
				beforeServerBuildRoutes: beforeServerBuildRoutesHook,
				beforeStartServer: beforeStartServerHook,
				afterStartServer: afterStartServerHook,
			})
			.addBodyReaderImplementation(bodyReaderImplementation);
		const getInterfaceHooks = vi.fn(() => [1] as never);
		const result = await implementHttpServer(
			{
				hub,
				httpServerParams,
				getInterfaceHooks,
			},
			async({ execRouteSystem, httpServerParams: receivedParams }) => {
				calls.push("initHttpServer");
				expect(receivedParams).toBe(httpServerParams);

				await execRouteSystem(
					{
						method: "GET",
						headers: {},
						host: "",
						origin: "",
						url: "/",
					},
					vi.fn(),
				);

				return server;
			},
		);

		expect(result).toBe(server);
		expect(routeHandler).toHaveBeenCalledOnce();
		expect(beforeServerBuildRoutesHook).toHaveBeenCalledOnce();
		expect(beforeStartServerHook).toHaveBeenCalledOnce();
		expect(afterStartServerHook).toHaveBeenCalledOnce();
		expect(calls).toStrictEqual([
			"beforeServerBuildRoutes",
			"beforeStartServer",
			"initHttpServer",
			"afterStartServer",
		]);
		expect(hub.hooksRouteLifeCycle[1]).toBe(1);
	});

	it("calls serverError hooks and whenUncaughtError when router execution fails", async() => {
		const expectedError = new Error("route-failure");
		const route = useRouteBuilder("GET", "/error", {
			hooks: [
				{
					beforeSendResponse: () => {
						throw expectedError;
					},
				},
			],
		})
			.handler(
				ResponseContract.noContent("ok"),
				(floor, { response }) => response("ok"),
			);

		const serverErrorHook = vi.fn(() => {
			throw new Error("server-error-hook-failure");
		});
		const whenUncaughtError = vi.fn(() => {
			throw new Error();
		});
		let execRouteSystem: AnyFunction | null = null;
		const spyConsole = vi.spyOn(console, "error").mockImplementation(() => void undefined);

		await implementHttpServer(
			{
				hub: createHub({ environment: "DEV" })
					.register(route)
					.addHubHooks({
						serverError: serverErrorHook,
					})
					.addBodyReaderImplementation(bodyReaderImplementation),
				httpServerParams: {} as HttpServerParams,
				getInterfaceHooks: () => [] as never,
			},
			({ execRouteSystem: receivedExecRouteSystem }) => {
				execRouteSystem = receivedExecRouteSystem;
				return { id: "server" };
			},
		);

		const routerInitializationData: RouterParams = {
			method: "GET",
			headers: {},
			host: "",
			origin: "",
			url: "/error",
		};

		await execRouteSystem!(routerInitializationData, whenUncaughtError);

		expect(serverErrorHook).toHaveBeenCalledWith({
			error: expectedError,
			exit: serverErrorExitHookFunction,
			next: serverErrorNextHookFunction,
			routerInitializationData,
		});
		expect(whenUncaughtError).toHaveBeenCalledWith(expectedError, routerInitializationData);
		expect(spyConsole).toHaveBeenCalledOnce();
	});
});
