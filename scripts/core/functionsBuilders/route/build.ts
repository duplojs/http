import { E, G, unwrap } from "@duplojs/utils";
import { buildStepFunction, type BuildStepFunctionParams } from "../steps";
import { type RouteFunctionBuilderParams, type BuildRouteNotSupportEither, type createRouteFunctionBuilder } from "./create";
import { type HookRouteLifeCycle, type Route } from "@core/route";
import { type ResponseContract } from "@core/response";

export interface BuildRouteFunctionParams extends BuildStepFunctionParams {
	readonly routeFunctionBuilders: readonly ReturnType<typeof createRouteFunctionBuilder>[];
	readonly globalHooksRouteLifeCycle: readonly HookRouteLifeCycle[];
	readonly defaultExtractContract: ResponseContract.Contract;
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
		defaultExtractContract: params.defaultExtractContract,
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
				if (unwrap(result) !== route) {
					return exit(result);
				}
				return next(lastValue);
			}

			return exit(result);
		},
	);
}
