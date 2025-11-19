import { buildRouter, createHub, defaultCheckerStepFunctionBuilder, defaultCutStepFunctionBuilder, defaultExtractStepFunctionBuilder, defaultHandlerStepFunctionBuilder, defaultProcessStepFunctionBuilder, defaultRouteFunctionBuilder, ResponseContract, RouterBuildError, stepKind, useRouteBuilder } from "@core";
import { DP } from "@duplojs/utils";
import { testRoute } from "@test-utils/route";

describe("buildRouter", () => {
	it("correct build router", async() => {
		const router = await buildRouter(
			createHub({
				environment: "DEV",
			})
				.addHooks({
					hooksHubLifeCycle: [{}],
					hooksRouteLifeCycle: [{}],
				})
				.addFunctionBuilder({
					routeFunctionBuilders: [defaultRouteFunctionBuilder],
					stepFunctionBuilders: [defaultCheckerStepFunctionBuilder],
				})
				.register([testRoute]),
		);

		expect(router).toStrictEqual({
			exec: expect.any(Function),
			hooksHubLifeCycle: [{}],
			hooksRouteLifeCycle: [{}],
			routeFunctionBuilders: [
				defaultRouteFunctionBuilder,
				defaultRouteFunctionBuilder,
			],
			routes: [testRoute],
			stepFunctionBuilders: [
				defaultCheckerStepFunctionBuilder,
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
					routes: [{} as any],
				}),
			),
		).rejects.instanceof(RouterBuildError);
	});

	it("throw error when build notfound route", async() => {
		const hub = createHub(
			[{ environment: "DEV" }],
			{
				notfoundHandler: stepKind.setTo({}) as any,
				defaultExtractContract: ResponseContract.badRequest("test"),
			},
		);

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
			path: "/test",
			query: {},
			url: "",
		});

		expect(spy).toHaveBeenCalled();
	});

	it("buildedRouter use notfound route after search route", async() => {
		const spy = vi.fn();
		const buildedRouter = await buildRouter(
			createHub({
				environment: "DEV",
				routes: [testRoute],
			})
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
			path: "/user",
			query: {},
			url: "",
		});

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
				routes: [route],
			})
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
			path: "/users",
			query: {},
			url: "",
		});

		expect(spyRoute).toHaveBeenCalled();
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
				routes: [route],
			})
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
			path: "/users/12",
			query: {},
			url: "",
		});

		expect(spyRoute).toHaveBeenCalledWith("12");
		expect(spyNotfound).not.toHaveBeenCalled();
	});
});
