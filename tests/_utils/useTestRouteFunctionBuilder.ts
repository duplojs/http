import { buildRouteFunction, type BuildRouteFunctionParams, defaultCheckerStepFunctionBuilder, defaultCutStepFunctionBuilder, defaultExtractStepFunctionBuilder, defaultHandlerStepFunctionBuilder, defaultProcessStepFunctionBuilder, defaultRouteFunctionBuilder, type Route, defaultExtractContract } from "@core";
import { E, unwrap } from "@duplojs/utils";

export async function useTestRouteFunctionBuilder(
	route: Route,
	params: Partial<BuildRouteFunctionParams> = {},
) {
	const result = await buildRouteFunction(
		route,
		{
			environment: "DEV",
			routeFunctionBuilders: [defaultRouteFunctionBuilder],
			stepFunctionBuilders: [
				defaultCheckerStepFunctionBuilder,
				defaultCutStepFunctionBuilder,
				defaultExtractStepFunctionBuilder,
				defaultHandlerStepFunctionBuilder,
				defaultProcessStepFunctionBuilder,
			],
			globalHooksRouteLifeCycle: [],
			defaultExtractContract,
			...params,
		},
	);

	if (E.isLeft(result)) {
		throw new Error("Route is not support.");
	}

	return unwrap(result);
}
