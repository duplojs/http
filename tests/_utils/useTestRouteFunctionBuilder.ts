import { buildRouteFunction, type BuildStepFunctionParams, defaultCheckerStepFunctionBuilder, defaultCutStepFunctionBuilder, defaultExtractStepFunctionBuilder, defaultHandlerStepFunctionBuilder, defaultProcessStepFunctionBuilder, defaultRouteFunctionBuilder, type Route } from "@core";
import { E, unwrap } from "@duplojs/utils";

export async function useTestRouteFunctionBuilder(
	route: Route,
	params: Partial<BuildStepFunctionParams> = {},
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
			...params,
		},
	);

	if (E.isLeft(result)) {
		throw new Error("Route is not support.");
	}

	return unwrap(result);
}
