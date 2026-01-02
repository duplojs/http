import { E, G, unwrap } from "@duplojs/utils";
import { type Steps } from "../../steps/types";
import { type BuildStepNotSupportEither, type StepFunctionBuilderParams, type createStepFunctionBuilder } from "./create";
import { type Environment } from "@core/types";
import { type ResponseContract } from "@core/response";

export interface BuildStepFunctionParams {
	readonly stepFunctionBuilders: readonly ReturnType<typeof createStepFunctionBuilder>[];

	readonly environment: Environment;

	readonly defaultExtractContract: ResponseContract.Contract;
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
		defaultExtractContract: params.defaultExtractContract,
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
				if (unwrap(result) !== step) {
					return exit(result);
				}
				return next(lastValue);
			}

			return exit(result);
		},
	);
}
