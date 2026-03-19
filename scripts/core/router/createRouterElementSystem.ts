import { asyncPipe, E, unwrap } from "@duplojs/utils";
import { buildRouteFunction, type BuildRouteFunctionParams } from "@core/functionsBuilders";
import { controlBodyAsEmpty } from "@core/request";
import { createRoute } from "@core/route";
import { RouterBuildError } from "./buildError";
import { defaultEmptyReaderImplementation } from "@core/hub";
import { type HandlerStep } from "@core/steps";
import { type RouterElementSystem } from "./types";

interface CreateRouterElementSystemParams {
	handlerStep: HandlerStep;
	buildParams: BuildRouteFunctionParams;
}

export async function createRouterElementSystem(params: CreateRouterElementSystemParams): Promise<RouterElementSystem> {
	const bodyController = controlBodyAsEmpty();
	const bodyReader = bodyController.createReaderOrThrow(
		defaultEmptyReaderImplementation,
	);

	const route = createRoute({
		method: "GET",
		paths: ["/"],
		hooks: [],
		preflightSteps: [],
		steps: [params.handlerStep],
		metadata: [],
		bodyController,
	});

	const buildedRoute = await asyncPipe(
		buildRouteFunction(
			route,
			params.buildParams,
		),
		E.whenIsLeft(
			(element) => {
				throw new RouterBuildError(route, element);
			},
		),
		unwrap,
	);

	return {
		bodyReader,
		buildedRoute,
	};
}
