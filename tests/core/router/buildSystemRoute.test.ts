import { E } from "@duplojs/utils";
import {
	Request,
	ResponseContract,
	RouterBuildError,
	createHandlerStep,
	createHub,
	defaultCheckerStepFunctionBuilder,
	defaultCutStepFunctionBuilder,
	defaultExtractStepFunctionBuilder,
	defaultHandlerStepFunctionBuilder,
	defaultProcessStepFunctionBuilder,
	defaultRouteFunctionBuilder,
	stepKind,
	buildSystemRoute,
} from "@core";

function makeBuildParams() {
	const hub = createHub({
		environment: "DEV",
	});

	return {
		environment: hub.config.environment,
		globalHooksRouteLifeCycle: hub.hooksRouteLifeCycle,
		routeFunctionBuilders: [
			...hub.routeFunctionBuilders,
			defaultRouteFunctionBuilder,
		],
		stepFunctionBuilders: [
			...hub.stepFunctionBuilders,
			defaultCheckerStepFunctionBuilder,
			defaultCutStepFunctionBuilder,
			defaultHandlerStepFunctionBuilder,
			defaultExtractStepFunctionBuilder,
			defaultProcessStepFunctionBuilder,
		],
		defaultExtractContract: hub.defaultExtractContract,
	};
}

describe("buildSystemRoute", () => {
	it("build system route with empty body reader", async() => {
		const spy = vi.fn();
		const handlerStep = createHandlerStep({
			responseContract: ResponseContract.noContent("system.route"),
			theFunction: async(__, { request, response }) => {
				spy(await request.getBody());
				return response("system.route", undefined as never);
			},
			metadata: [],
		});

		const { bodyReader, buildedRoute } = await buildSystemRoute({
			handlerStep,
			buildParams: makeBuildParams(),
		});

		await buildedRoute(
			new Request({
				headers: {},
				host: "",
				matchedPath: null,
				method: "GET",
				origin: "",
				params: {},
				path: "/",
				query: {},
				url: "/",
				bodyReader,
			}),
		);

		expect(spy).toHaveBeenCalledWith(E.success(undefined));
	});

	it("throw RouterBuildError when handler step cannot be build", async() => {
		await expect(
			buildSystemRoute({
				handlerStep: stepKind.setTo({}) as never,
				buildParams: makeBuildParams(),
			}),
		).rejects.instanceof(RouterBuildError);
	});
});
