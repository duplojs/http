import { createRouter, createHub, defaultCheckerStepFunctionBuilder, defaultCutStepFunctionBuilder, defaultExtractStepFunctionBuilder, defaultHandlerStepFunctionBuilder, defaultProcessStepFunctionBuilder, defaultRouteFunctionBuilder, NotFoundBodyReaderImplementationError, ResponseContract, RouterBuildError, stepKind, TextBodyController, useRouteBuilder, Request } from "@core";
import { DP, E } from "@duplojs/utils";
import { testRoute } from "@test-utils/route";

describe("buildRouter", () => {
	const textBodyReaderImplementation = TextBodyController
		.createReaderImplementation(() => Promise.resolve(E.success(null)));

	it("correct build router", async() => {
		const otherRoute = { ...testRoute };
		const spyRouterBuilder = vi.fn(() => Promise.resolve(true) as never);
		const router = await createRouter(
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
				.setRouterFunctionBuilder(spyRouterBuilder)
				.addBodyReaderImplementation(textBodyReaderImplementation),
		);

		expect(router).toStrictEqual({
			exec: true,
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

		expect(spyRouterBuilder).toHaveBeenCalledWith({
			classRequest: Request,
			environment: "DEV",
			malformedUrlRouterElement: expect.any(Object),
			notfoundRouterElement: expect.any(Object),
			routerElementWrapper: {
				GET: [
					expect.objectContaining({
						matchedPath: "/test",
					}),
					expect.objectContaining({
						matchedPath: "/test",
					}),
				],
			},
		});
	});

	it("throw error when build route", async() => {
		await expect(
			createRouter(
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
			createRouter(
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
			createRouter(
				hub,
			),
		).rejects.instanceof(RouterBuildError);
	});
});
