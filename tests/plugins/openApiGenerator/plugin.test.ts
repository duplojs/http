import { createHub, launchHookServer, ResponseContract, useRouteBuilder } from "@core";
import { setEnvironment, TESTImplementation } from "@duplojs/server-utils";
import { DPE, E } from "@duplojs/utils";
import { openApiGeneratorPlugin } from "@plugin-openApiGenerator";
import { testHub } from "@test-utils/hub";

describe("plugin implementation", () => {
	setEnvironment("TEST");
	const spy = vi.fn((path: string, content: string) => Promise.resolve(E.ok()));
	TESTImplementation.set("writeTextFile", spy);

	beforeEach(() => {
		spy.mockClear();
	});

	const route = useRouteBuilder("GET", "/user")
		.extract({
			headers: {
				header1: DPE.string(),
				header2: DPE.string(),
			},
			body: DPE.object({
				name: DPE.string(),
				age: DPE.number(),
			}),
		})
		.cut(
			ResponseContract.conflict("the-conflict"),
			(__, { response }) => response("the-conflict"),
		)
		.handler(
			ResponseContract.ok("success", DPE.string()),
			(__, { response }) => response("success", ""),
		);

	it("generate OpenApi file", async() => {
		const hub = testHub
			.plug(openApiGeneratorPlugin({
				outputFile: "swagger.json",
			}))
			.register(route);

		await launchHookServer(
			hub.aggregatesHooksHubLifeCycle("beforeServerBuildRoutes"),
			hub,
			{},
		);

		expect(spy.mock.lastCall?.at(0)).toBe("swagger.json");
		expect(spy.mock.lastCall?.at(1)).toMatchSnapshot();
	});

	it("generate OpenApi file with type bearer ok security option", async() => {
		const hub = testHub
			.plug(
				openApiGeneratorPlugin({
					outputFile: "swagger.json",
					routePath: "/swagger",
					security: { type: "bearer" },
				}),
			)
			.register(route);

		await launchHookServer(
			hub.aggregatesHooksHubLifeCycle("beforeServerBuildRoutes"),
			hub,
			{},
		);

		expect(spy.mock.lastCall?.at(0)).toBe("swagger.json");
		expect(spy.mock.lastCall?.at(1)).toMatchSnapshot();
	});

	it("generate OpenApi file with type apiKey ok security option", async() => {
		const hub = testHub
			.plug(openApiGeneratorPlugin({
				outputFile: "swagger.json",
				routePath: "/swagger",
				security: {
					type: "apiKey",
					in: "cookie",
					paramName: "token",
				},
			}))
			.register(route);

		await launchHookServer(
			hub.aggregatesHooksHubLifeCycle("beforeServerBuildRoutes"),
			hub,
			{},
		);

		expect(spy.mock.lastCall?.at(0)).toBe("swagger.json");
		expect(spy.mock.lastCall?.at(1)).toMatchSnapshot();
	});

	it("not generate OpenApi file", async() => {
		const hub = testHub
			.plug(openApiGeneratorPlugin({
				routePath: "/swagger",
			}))
			.register(route);

		await launchHookServer(
			hub.aggregatesHooksHubLifeCycle("beforeServerBuildRoutes"),
			hub,
			{},
		);

		expect(spy).not.toHaveBeenCalled();
	});

	it("empty route", async() => {
		const hub = testHub
			.plug(openApiGeneratorPlugin({
				outputFile: "./swagger.json",
			}));

		await launchHookServer(
			hub.aggregatesHooksHubLifeCycle("beforeServerBuildRoutes"),
			hub,
			{},
		);

		expect(spy).not.toHaveBeenCalled();
	});

	it("empty params", async() => {
		const hub = testHub
			.plug(openApiGeneratorPlugin({}));

		await launchHookServer(
			hub.aggregatesHooksHubLifeCycle("beforeServerBuildRoutes"),
			hub,
			{},
		);

		expect(spy).not.toHaveBeenCalled();
	});

	it("empty params", async() => {
		const hub = testHub
			.plug(openApiGeneratorPlugin({}));

		await launchHookServer(
			hub.aggregatesHooksHubLifeCycle("beforeServerBuildRoutes"),
			hub,
			{},
		);

		expect(spy).not.toHaveBeenCalled();
	});

	it("not generate in PROD env", async() => {
		const hub = createHub({ environment: "PROD" })
			.plug(openApiGeneratorPlugin({ outputFile: "swagger.json" }));

		await launchHookServer(
			hub.aggregatesHooksHubLifeCycle("beforeServerBuildRoutes"),
			hub,
			{},
		);

		expect(spy).not.toHaveBeenCalled();
	});
});
