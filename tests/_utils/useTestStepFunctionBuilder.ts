import { buildStepFunction, type BuildStepFunctionParams, defaultCheckerStepFunctionBuilder, defaultCutStepFunctionBuilder, defaultExtractContract, defaultExtractStepFunctionBuilder, defaultHandlerStepFunctionBuilder, type Steps } from "@core";
import { E, unwrap } from "@duplojs/utils";

export async function useTestStepFunctionBuilder(
	step: Steps,
	params: Partial<BuildStepFunctionParams> = {},
) {
	const result = await buildStepFunction(
		step,
		{
			environment: "DEV",
			stepFunctionBuilders: [
				defaultCheckerStepFunctionBuilder,
				defaultCutStepFunctionBuilder,
				defaultExtractStepFunctionBuilder,
				defaultHandlerStepFunctionBuilder,
			],
			...params,
			defaultExtractContract: params.defaultExtractContract ?? defaultExtractContract,
		},
	);

	if (E.isLeft(result)) {
		throw new Error("Step is not support.");
	}

	return unwrap(result);
}
