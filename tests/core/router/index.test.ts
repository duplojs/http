import { buildRouter, createHub, defaultCheckerStepFunctionBuilder, defaultCutStepFunctionBuilder, defaultExtractStepFunctionBuilder, defaultHandlerStepFunctionBuilder, defaultProcessStepFunctionBuilder, defaultRouteFunctionBuilder, ResponseContract, routeKind, RouterBuildError, stepKind, useRouteBuilder } from "@core";
import { DP } from "@duplojs/utils";
import { testRoute } from "@test-utils/route";

describe("buildRouter", () => {
	it("correct build router", async() => {
		const router = await buildRouter(
			createHub({
				environment: "DEV",
			})
				.addHubHooks([{}])
				.addRouteHooks([{}])
				.addRouteFunctionBuilder([defaultRouteFunctionBuilder])
				.addStepFunctionBuilder([defaultCheckerStepFunctionBuilder])
				.register([testRoute])
				.plug({
					name: "plugin",
					hooksHubLifeCycle: [{}],
					hooksRouteLifeCycle: [{}],
					routeFunctionBuilders: [defaultRouteFunctionBuilder],
					stepFunctionBuilders: [defaultCutStepFunctionBuilder],
					routes: [testRoute],
				}),
		);

		expect(router).toStrictEqual({
			exec: expect.any(Function),
			hooksHubLifeCycle: [{}, {}],
			hooksRouteLifeCycle: [{}, {}],
			routeFunctionBuilders: [
				defaultRouteFunctionBuilder,
				defaultRouteFunctionBuilder,
				defaultRouteFunctionBuilder,
			],
			routes: [testRoute, testRoute],
			stepFunctionBuilders: [
				defaultCheckerStepFunctionBuilder,
				defaultCheckerStepFunctionBuilder,
				defaultCutStepFunctionBuilder,
				defaultHandlerStepFunctionBuilder,
				defaultExtractStepFunctionBuilder,
				defaultProcessStepFunctionBuilder,
				defaultCutStepFunctionBuilder,
			],
		});
	});

	it("throw error when build route", async() => {
		await expect(
			buildRouter(
				createHub({
					environment: "DEV",
				})
					.register([{}] as any),
			),
		).rejects.instanceof(RouterBuildError);
	});

	it("throw error when build notfound route", async() => {
		const hub = createHub({ environment: "DEV" });

		(hub as any).notfoundHandler = stepKind.setTo({}) as any;

		await expect(
			buildRouter(
				hub,
			),
		).rejects.instanceof(RouterBuildError);
	});

	it("buildedRouter use notfound route when exec them", async() => {
		const spy = vi.fn();
		const buildedRouter = await buildRouter(
			createHub({ environment: "DEV" })
				.setNotfoundHandler(
					ResponseContract.notFound("notfound"),
					({ response }) => {
						spy();
						return response("notfound");
					},
				),
		);

		await buildedRouter.exec({
			headers: {},
			host: "",
			method: "SuperMethod",
			origin: "",
			url: "/test",
		});

		expect(spy).toHaveBeenCalled();
	});

	it("buildedRouter use notfound route after search route", async() => {
		const spyRoute = vi.fn();
		const route = useRouteBuilder("GET", "/users")
			.handler(
				ResponseContract.ok("users.find", DP.empty()),
				(floor, { response }) => {
					spyRoute();
					return response("users.find");
				},
			);

		const spy = vi.fn();
		const buildedRouter = await buildRouter(
			createHub({
				environment: "DEV",
			})
				.register(route)
				.setNotfoundHandler(
					ResponseContract.notFound("notfound"),
					({ response }) => {
						spy();
						return response("notfound");
					},
				),
		);

		await buildedRouter.exec({
			headers: {},
			host: "",
			method: "GET",
			origin: "",
			url: "/admins",
		});

		expect(spyRoute).not.toHaveBeenCalled();
		expect(spy).toHaveBeenCalled();
	});

	it("buildedRouter exec route", async() => {
		const spyRoute = vi.fn();
		const route = useRouteBuilder("GET", "/users")
			.handler(
				ResponseContract.ok("users.find", DP.empty()),
				(floor, { response }) => {
					spyRoute();
					return response("users.find");
				},
			);

		const spyNotfound = vi.fn();
		const buildedRouter = await buildRouter(
			createHub({
				environment: "DEV",
			})
				.register(route)
				.setNotfoundHandler(
					ResponseContract.notFound("notfound"),
					({ response }) => {
						spyNotfound();
						return response("notfound");
					},
				),
		);

		await buildedRouter.exec({
			headers: {},
			host: "",
			method: "GET",
			origin: "",
			url: "/users",
		});

		expect(spyRoute).toHaveBeenCalled();
		expect(spyNotfound).not.toHaveBeenCalled();
	});

	it("buildedRouter skip route when pattern not match and execute next", async() => {
		const spyRoute = vi.fn();
		const route = useRouteBuilder("GET", "/users")
			.handler(
				ResponseContract.ok("users.find", DP.empty()),
				(floor, { response }) => {
					spyRoute();
					return response("users.find");
				},
			);

		const spyRoute2 = vi.fn();
		const route2 = useRouteBuilder("GET", "/admins")
			.handler(
				ResponseContract.ok("admins.find", DP.empty()),
				(floor, { response }) => {
					spyRoute2();
					return response("admins.find");
				},
			);

		const spyNotfound = vi.fn();
		const buildedRouter = await buildRouter(
			createHub({
				environment: "DEV",
			})
				.register([route, route2])
				.setNotfoundHandler(
					ResponseContract.notFound("notfound"),
					({ response }) => {
						spyNotfound();
						return response("notfound");
					},
				),
		);

		await buildedRouter.exec({
			headers: {},
			host: "",
			method: "GET",
			origin: "",
			url: "/admins",
		});

		expect(spyRoute).not.toHaveBeenCalled();
		expect(spyRoute2).toHaveBeenCalled();
		expect(spyNotfound).not.toHaveBeenCalled();
	});

	it("buildedRouter exec route with parameter", async() => {
		const spyRoute = vi.fn();
		const route = useRouteBuilder("GET", "/users/{userId}")
			.extract({
				params: {
					userId: DP.coerce.string(),
				},
			})
			.handler(
				ResponseContract.ok("users.find", DP.string()),
				({ userId }, { response }) => {
					spyRoute(userId);
					return response("users.find", userId);
				},
			);

		const spyNotfound = vi.fn();
		const buildedRouter = await buildRouter(
			createHub({
				environment: "DEV",
			})
				.register(route)
				.setNotfoundHandler(
					ResponseContract.notFound("notfound"),
					({ response }) => {
						spyNotfound();
						return response("notfound");
					},
				),
		);

		await buildedRouter.exec({
			headers: {},
			host: "",
			method: "GET",
			origin: "",
			url: "/users/12",
		});

		expect(spyRoute).toHaveBeenCalledWith("12");
		expect(spyNotfound).not.toHaveBeenCalled();
	});
});
