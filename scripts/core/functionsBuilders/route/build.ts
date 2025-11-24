import { E, G } from "@duplojs/utils";
import { buildStepFunction, type BuildStepFunctionParams } from "../steps";
import { type RouteFunctionBuilderParams, type BuildRouteNotSupportEither, type createRouteFunctionBuilder } from "./create";
import { type HookRouteLifeCycle, type Route } from "@core/route";

export interface BuildRouteFunctionParams extends BuildStepFunctionParams {
	readonly routeFunctionBuilders: readonly ReturnType<typeof createRouteFunctionBuilder>[];
	readonly globalHooksRouteLifeCycle: readonly HookRouteLifeCycle[];
}

export function buildRouteFunction(
	route: Route,
	params: BuildRouteFunctionParams,
) {
	const functionParams: RouteFunctionBuilderParams = {
		success(value) {
			return E.right("buildSuccess", value);
		},
		buildStep(step) {
			return buildStepFunction(step, params);
		},
		environment: params.environment,
		globalHooksRouteLifeCycle: params.globalHooksRouteLifeCycle,
	};

	return G.asyncReduce(
		params.routeFunctionBuilders,
		G.reduceFrom<BuildRouteNotSupportEither>(E.left("routeNotSupport", route)),
		async({
			element: functionBuilder,
			lastValue,
			next,
			exit,
		}) => {
			const result = await functionBuilder(route, functionParams);

			if (E.isLeft(result)) {
				return next(lastValue);
			}

			return exit(result);
		},
	);
}
