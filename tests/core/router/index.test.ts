import { buildRouter, createHub, defaultCheckerStepFunctionBuilder, defaultCutStepFunctionBuilder, defaultExtractStepFunctionBuilder, defaultHandlerStepFunctionBuilder, defaultProcessStepFunctionBuilder, defaultRouteFunctionBuilder, NotFoundBodyReaderImplementationError, ResponseContract, RouterBuildError, stepKind, TextBodyController, useRouteBuilder } from "@core";
import { DP, E } from "@duplojs/utils";
import { testRoute } from "@test-utils/route";

describe("buildRouter", () => {
	const textBodyReaderImplementation = TextBodyController
		.createReaderImplementation(() => Promise.resolve(E.success(null)));

	it("correct build router", async() => {
		const otherRoute = { ...testRoute };
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
					routes: [otherRoute],
				})
				.addBodyReaderImplementation(textBodyReaderImplementation),
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
			routes: new Set([testRoute, otherRoute]),
			stepFunctionBuilders: [
				defaultCheckerStepFunctionBuilder,
				defaultCutStepFunctionBuilder,
				defaultCheckerStepFunctionBuilder,
				defaultCutStepFunctionBuilder,
				defaultHandlerStepFunctionBuilder,
				defaultExtractStepFunctionBuilder,
				defaultProcessStepFunctionBuilder,
			],
		});
	});

	it("throw error when build route", async() => {
		await expect(
			buildRouter(
				createHub({
					environment: "DEV",
				})
					.register([{}] as any)
					.addBodyReaderImplementation(textBodyReaderImplementation),
			),
		).rejects.instanceof(RouterBuildError);
	});

	it("throw error when not found body reader implementation", async() => {
		await expect(
			buildRouter(
				createHub({
					environment: "DEV",
				})
					.register(testRoute),
			),
		).rejects.instanceof(NotFoundBodyReaderImplementationError);
	});

	it("throw error when build notfound route", async() => {
		const hub = createHub({ environment: "DEV" })
			.addBodyReaderImplementation(textBodyReaderImplementation);

		(hub as any).notfoundHandler = stepKind.setTo({}) as any;

		await expect(
			buildRouter(
				hub,
			),
		).rejects.instanceof(RouterBuildError);
	});

	it("buildedRouter use malformed url route with fallback request values", async() => {
		const spy = vi.fn();
		const buildedRouter = await buildRouter(
			createHub({ environment: "DEV" })
				.setMalformedUrlHandler(
					ResponseContract.badRequest("malformed"),
					async({ request, response }) => {
						spy({
							matchedPath: request.matchedPath,
							params: request.params,
							path: request.path,
							query: request.query,
							body: await request.getBody(),
						});
						return response("malformed");
					},
				)
				.addBodyReaderImplementation(textBodyReaderImplementation),
		);

		await buildedRouter.exec({
			headers: {},
			host: "",
			method: "GET",
			origin: "",
			url: "/%E0%A4%A",
		});

		expect(spy).toHaveBeenCalledWith({
			matchedPath: null,
			params: {},
			path: "",
			query: {},
			body: E.success(undefined),
		});
	});

	it("buildedRouter use notfound route when method group does not exist", async() => {
		const spy = vi.fn();
		const route = useRouteBuilder("GET", "/users")
			.handler(
				ResponseContract.ok("users.find", DP.empty()),
				(__, { response }) => response("users.find"),
			);

		const buildedRouter = await buildRouter(
			createHub({ environment: "DEV" })
				.register(route)
				.setNotfoundHandler(
					ResponseContract.notFound("notfound"),
					async({ request, response }) => {
						spy({
							matchedPath: request.matchedPath,
							params: request.params,
							path: request.path,
							query: request.query,
							body: await request.getBody(),
						});
						return response("notfound");
					},
				)
				.addBodyReaderImplementation(textBodyReaderImplementation),
		);

		await buildedRouter.exec({
			headers: {},
			host: "",
			method: "POST",
			origin: "",
			url: "/users?role=admin",
		});

		expect(spy).toHaveBeenCalledWith({
			matchedPath: null,
			params: {},
			path: "/users",
			query: {
				role: "admin",
			},
			body: E.success(undefined),
		});
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
				)
				.addBodyReaderImplementation(textBodyReaderImplementation),
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
				)
				.addBodyReaderImplementation(textBodyReaderImplementation),
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
				)
				.addBodyReaderImplementation(textBodyReaderImplementation),
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
});
