import {
	createHub,
	HookResponse,
	launchHookBeforeBuildRoute,
	launchHookServer,
	Request,
	Response,
	type RequestInitializationData,
	ResponseContract,
	useRouteBuilder,
	type ResponseCode,
} from "@core";
import { A, equal } from "@duplojs/utils";
import { corsPlugin } from "@plugin-cors";
import { IgnoreRouteCorsMetadata } from "@plugin-cors/metadata";
import { createBodyReader } from "@test-utils/bodyReader";

export const basicRoutes = [
	useRouteBuilder("GET", "/users")
		.handler(
			ResponseContract.noContent("list-users"),
			(__, { response }) => response("list-users"),
		),
	useRouteBuilder("POST", "/users")
		.handler(
			ResponseContract.noContent("create-user"),
			(__, { response }) => response("create-user"),
		),
	useRouteBuilder("PUT", "/users")
		.handler(
			ResponseContract.noContent("update-user"),
			(__, { response }) => response("update-user"),
		),
] as const;

function createTestRequest(
	input: Partial<RequestInitializationData> = {},
) {
	return new Request({
		method: "OPTIONS",
		headers: {},
		url: "https://example.com/test",
		host: "example.com",
		origin: "https://example.com",
		matchedPath: null,
		params: {},
		path: "/test",
		query: {},
		bodyReader: createBodyReader(),
		...input,
	});
}

describe("cors plugin", () => {
	it("when building routes, injects cors options route", async() => {
		const hub = createHub({ environment: "DEV" })
			.plug(
				corsPlugin({
					allowOrigin: true,
					allowMethods: true,
				}),
			)
			.register(basicRoutes);

		await launchHookServer(
			hub.aggregatesHooksHubLifeCycle("beforeServerBuildRoutes"),
			hub,
			{} as never,
		);

		const routes = A.from(hub.routes);
		const optionsRoute = A.find(routes, (route) => route.definition.method === "OPTIONS");

		expect(routes).toHaveLength(4);
		expect(optionsRoute?.definition.paths).toStrictEqual(["/*"]);
		expect(optionsRoute?.definition.hooks).toHaveLength(1);

		const routeAfterHook = await launchHookBeforeBuildRoute(
			hub.aggregatesHooksHubLifeCycle("beforeBuildRoute"),
			basicRoutes[0],
		);

		expect(routeAfterHook.definition.hooks).toHaveLength(
			basicRoutes[0].definition.hooks.length + 1,
		);
	});

	it("when sending a standard response, applies cors headers", async() => {
		const hub = createHub({ environment: "DEV" })
			.plug(
				corsPlugin({
					allowOrigin: "https://example.com",
					exposeHeaders: ["x-test", "x-other"],
					credentials: true,
				}),
			)
			.register(basicRoutes);

		const routeAfterHook = await launchHookBeforeBuildRoute(
			hub.aggregatesHooksHubLifeCycle("beforeBuildRoute"),
			basicRoutes[0],
		);
		const response = new Response("204", "cors", undefined);
		const nextResult = Symbol("next");
		const beforeSendResponse = routeAfterHook.definition.hooks[0]!.beforeSendResponse!;

		const result = beforeSendResponse({
			request: createTestRequest(),
			currentResponse: response,
			next: () => nextResult as never,
			exit: () => null as never,
		} as never);

		expect(result).toBe(nextResult);
		expect(response.headers).toStrictEqual({
			vary: "Origin",
			"access-control-allow-origin": "https://example.com",
			"access-control-expose-headers": "x-test,x-other",
			"access-control-allow-credentials": "true",
		});
	});

	it("when allowOrigin is a function", async() => {
		const hub = createHub({ environment: "DEV" })
			.plug(
				corsPlugin({
					allowOrigin: equal("https://example.com"),
				}),
			)
			.register(basicRoutes);

		const routeAfterHook = await launchHookBeforeBuildRoute(
			hub.aggregatesHooksHubLifeCycle("beforeBuildRoute"),
			basicRoutes[0],
		);
		const response = new Response("204", "cors", undefined);
		const nextResult = Symbol("next");
		const beforeSendResponse = routeAfterHook.definition.hooks[0]!.beforeSendResponse!;

		const result = await beforeSendResponse({
			request: createTestRequest(),
			currentResponse: response,
			next: () => nextResult as never,
			exit: () => null as never,
		} as never);

		expect(result).toBe(nextResult);
		expect(response.headers).toStrictEqual({
			vary: "Origin",
			"access-control-allow-origin": "https://example.com",
		});
	});

	it("when route to the IgnoreRouteCorsMetadata, does not inject cors hook", async() => {
		const hub = createHub({ environment: "DEV" })
			.plug(
				corsPlugin({
					allowOrigin: true,
				}),
			)
			.register(basicRoutes);
		const ignoredRoute = useRouteBuilder("GET", "/ignored", {
			metadata: [IgnoreRouteCorsMetadata()],
		}).handler(
			ResponseContract.noContent("ignored"),
			(__, { response }) => response("ignored"),
		);

		const routeAfterHook = await launchHookBeforeBuildRoute(
			hub.aggregatesHooksHubLifeCycle("beforeBuildRoute"),
			ignoredRoute,
		);

		expect(routeAfterHook).toBe(ignoredRoute);
	});

	it("i'm out of ideas for 'it message'", async() => {
		const hub = createHub({ environment: "DEV" })
			.plug(
				corsPlugin({
					allowMethods: ["GET", "POST"],
					allowHeaders: ["content-type", "authorization"],
					maxAge: 60,
				}),
			)
			.register(basicRoutes);

		await launchHookServer(
			hub.aggregatesHooksHubLifeCycle("beforeServerBuildRoutes"),
			hub,
			{} as never,
		);

		const optionsRoute = A.find(
			A.from(hub.routes),
			(route) => route.definition.method === "OPTIONS",
		)!;
		const beforeRouteExecution = optionsRoute.definition.hooks[0]!.beforeRouteExecution!;

		const response = beforeRouteExecution({
			request: createTestRequest(),
			response: (code, information) => new HookResponse("beforeRouteExecution", code, information, undefined),
			next: () => null as never,
			exit: () => null as never,
		}) as HookResponse<ResponseCode, string, unknown>;

		expect(response.headers).toStrictEqual({
			"access-control-allow-methods": "GET,POST",
			"access-control-allow-headers": "content-type,authorization",
			"access-control-max-age": "60",
		});
	});

	it("when allowMethods is true, resolves methods from request path", async() => {
		const hub = createHub({ environment: "DEV" })
			.plug(
				corsPlugin({
					allowMethods: true,
				}),
			)
			.register(basicRoutes);

		await launchHookServer(
			hub.aggregatesHooksHubLifeCycle("beforeServerBuildRoutes"),
			hub,
			{} as never,
		);

		const optionsRoute = A.find(
			A.from(hub.routes),
			(route) => route.definition.method === "OPTIONS",
		)!;
		const beforeRouteExecution = optionsRoute.definition.hooks[0]!.beforeRouteExecution!;

		const response = beforeRouteExecution({
			request: createTestRequest({
				path: "/users",
				matchedPath: "/*",
			}),
			response: (code, information) => new HookResponse("beforeRouteExecution", code, information, undefined),
			next: () => null as never,
			exit: () => null as never,
		}) as HookResponse<ResponseCode, string, unknown>;

		expect(response.headers).toStrictEqual({
			"access-control-allow-methods": "GET,POST,PUT",
		});
	});

	it("when allowHeaders accepts everything (*)", async() => {
		const hub = createHub({ environment: "DEV" })
			.plug(
				corsPlugin({
					allowHeaders: true,
				}),
			)
			.register(basicRoutes);

		await launchHookServer(
			hub.aggregatesHooksHubLifeCycle("beforeServerBuildRoutes"),
			hub,
			{} as never,
		);

		const optionsRoute = A.find(
			A.from(hub.routes),
			(route) => route.definition.method === "OPTIONS",
		)!;
		const beforeRouteExecution = optionsRoute.definition.hooks[0]!.beforeRouteExecution!;

		const response = beforeRouteExecution({
			request: createTestRequest(),
			response: (code, information) => new HookResponse("beforeRouteExecution", code, information, undefined),
			next: () => null as never,
			exit: () => null as never,
		}) as HookResponse<ResponseCode, string, unknown>;

		expect(response.headers).toStrictEqual({
			"access-control-allow-headers": "*",
		});
	});
});
