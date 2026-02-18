import { E, type MaybePromise } from "@duplojs/utils";
import { type Steps } from "../../steps/types";
import { type Floor } from "@core/floor";
import { type HookRouteLifeCycle } from "@core/route";
import { type Request } from "@core/request";
import { type ResponseContract, type PredictedResponse } from "@core/response";
import { type Environment } from "@core/types";

export type BuildedStepFunction = (
	request: Request,
	floor: Floor
) => MaybePromise<Floor | PredictedResponse>;

export interface BuildStepResult {
	readonly buildedFunction: BuildedStepFunction;
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
