import { E, type MaybePromise } from "@duplojs/utils";
import { type BuildedStep, type Steps } from "../../steps/types";
import { type HookRouteLifeCycle } from "../../route";
import { type ResponseContract } from "../../response";
import { type Environment } from "../../types";
export interface BuildStepResult {
    readonly buildedFunction: BuildedStep;
    readonly hooksRouteLifeCycle: readonly HookRouteLifeCycle[];
}
export type BuildStepSuccessEither = E.Right<"buildSuccess", BuildStepResult>;
export type BuildStepNotSupportEither = E.Left<"stepNotSupport", Steps>;
export interface StepFunctionBuilderParams {
    buildStep(element: Steps): Promise<BuildStepSuccessEither | BuildStepNotSupportEither>;
    success(result: BuildStepResult): BuildStepSuccessEither;
    readonly environment: Environment;
    readonly defaultExtractContract: ResponseContract.Contract;
}
export declare function createStepFunctionBuilder<GenericSupportStep extends Steps>(support: (step: Steps) => step is GenericSupportStep, builder: (step: GenericSupportStep, params: StepFunctionBuilderParams) => MaybePromise<BuildStepSuccessEither | BuildStepNotSupportEither>): (step: Steps, params: StepFunctionBuilderParams) => MaybePromise<BuildStepSuccessEither | BuildStepNotSupportEither>;
