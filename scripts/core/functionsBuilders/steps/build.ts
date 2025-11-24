import { E, G } from "@duplojs/utils";
import { type Steps } from "../../steps/types";
import { type BuildStepNotSupportEither, type StepFunctionBuilderParams, type createStepFunctionBuilder } from "./create";
import { type Environment } from "@core/types";

export interface BuildStepFunctionParams {
	readonly stepFunctionBuilders: readonly ReturnType<typeof createStepFunctionBuilder>[];

	readonly environment: Environment;
}

export function buildStepFunction(
	step: Steps,
	params: BuildStepFunctionParams,
) {
	const functionParams: StepFunctionBuilderParams = {
		success(value) {
			return E.right("buildSuccess", value);
		},
		buildStep(step) {
			return buildStepFunction(step, params);
		},
		environment: params.environment,
	};

	return G.asyncReduce(
		params.stepFunctionBuilders,
		G.reduceFrom<BuildStepNotSupportEither>(E.left("stepNotSupport", step)),
		async({
			element: functionBuilder,
			lastValue,
			next,
			exit,
		}) => {
			const result = await functionBuilder(step, functionParams);

			if (E.isLeft(result)) {
				return next(lastValue);
			}

			return exit(result);
		},
	);
}
