import { E, type MaybePromise } from "@duplojs/utils";
import { type BuildedStep, type Steps } from "../../steps/types";
import { type HookRouteLifeCycle } from "@core/route";
import { type ResponseContract } from "@core/response";
import { type Environment } from "@core/types";

export interface BuildStepResult {
	readonly buildedFunction: BuildedStep;
	readonly hooksRouteLifeCycle: readonly HookRouteLifeCycle[];
}

export type BuildStepSuccessEither<
> = E.Right<"buildSuccess", BuildStepResult>;

export type BuildStepNotSupportEither = E.Left<"stepNotSupport", Steps>;

export interface StepFunctionBuilderParams {
	buildStep(
		element: Steps
	): Promise<
		| BuildStepSuccessEither
		| BuildStepNotSupportEither
	>;

	success(
		result: BuildStepResult
	): BuildStepSuccessEither;

	readonly environment: Environment;

	readonly defaultExtractContract: ResponseContract.Contract;
}

export function createStepFunctionBuilder<
	GenericSupportStep extends Steps,
>(
	support: (step: Steps) => step is GenericSupportStep,
	builder: (
		step: GenericSupportStep,
		params: StepFunctionBuilderParams,
	) => MaybePromise<
		| BuildStepSuccessEither
		| BuildStepNotSupportEither
	>,
) {
	return (
		step: Steps,
		params: StepFunctionBuilderParams,
	): MaybePromise<
		| BuildStepSuccessEither
		| BuildStepNotSupportEither
	> => support(step)
		? builder(
			step,
			params,
		)
		: E.left("stepNotSupport", step);
}
