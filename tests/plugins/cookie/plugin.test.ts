import { createHub, launchHookBeforeBuildRoute, Request, Response, ResponseContract, useRouteBuilder } from "@core";
import { cookiePlugin } from "@plugin-cookie";
import { IgnoreRouteCookieMetadata } from "@plugin-cookie/metadata";
import { createBodyReader } from "@test-utils/bodyReader";

function createRequest() {
	return new Request({
		method: "GET",
		headers: {
			cookie: "session=value",
		},
		url: "http://localhost/test",
		host: "localhost",
		origin: "http://localhost",
		matchedPath: null,
		params: {},
		path: "/test",
		query: {},
		bodyReader: createBodyReader(),
	});
}

describe("cookie plugin", () => {
	it("returns the plugin definition with a beforeBuildRoute hook", () => {
		const plugin = cookiePlugin()();

		expect(plugin).toStrictEqual({
			name: "cookie-plugin",
			hooksHubLifeCycle: [
				expect.objectContaining({
					beforeBuildRoute: expect.any(Function),
				}),
			],
		});
	});

	it("injects the combined cookie hook and wires custom parser and serializer", async() => {
		const parser = vi.fn(() => ({ session: "parsed" }));
		const serializer = vi.fn((name: string) => `${name}=custom`);
		const hub = createHub({ environment: "DEV" })
			.plug(
				cookiePlugin({
					parser,
					serializer,
				}),
			);
		const route = useRouteBuilder("GET", "/test")
			.handler(
				ResponseContract.noContent("test"),
				(__, { response }) => response("test"),
			);

		const routeAfterHook = await launchHookBeforeBuildRoute(
			hub.aggregatesHooksHubLifeCycle("beforeBuildRoute"),
			route,
		);
		const hook = routeAfterHook.definition.hooks.at(-1)!;
		const request = createRequest();
		const response = new Response("200", "ok", undefined)
			.setCookie("session", "value");

		await hook.beforeRouteExecution!(
			{
				request,
				next: () => undefined as never,
				exit: () => null as never,
				response: () => null as never,
			},
		);
		await hook.beforeSendResponse!(
			{
				request,
				currentResponse: response,
				next: () => undefined as never,
				exit: () => null as never,
			},
		);

		expect(routeAfterHook.definition.hooks).toHaveLength(route.definition.hooks.length + 1);
		expect(parser).toHaveBeenCalledExactlyOnceWith("session=value");
		expect(request.cookies).toStrictEqual({ session: "parsed" });
		expect(serializer).toHaveBeenCalledExactlyOnceWith("session", "value", undefined);
		expect(response.headers?.["set-cookie"]).toStrictEqual(["session=custom"]);
	});

	it("does not inject the hook when IgnoreRouteCookieMetadata is present", async() => {
		const hub = createHub({ environment: "DEV" })
			.plug(cookiePlugin());
		const ignoredRoute = useRouteBuilder("GET", "/ignored", {
			metadata: [IgnoreRouteCookieMetadata()],
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
});
