import { type Steps } from "../../../steps";
import { type BuildStepResult, type StepFunctionBuilderParams } from "../create";
export declare function buildStepsFunction(steps: readonly Steps[], buildStep: StepFunctionBuilderParams["buildStep"]): Promise<import("..").BuildStepNotSupportEither | BuildStepResult[]>;
export declare const defaultProcessStepFunctionBuilder: (step: Steps, params: StepFunctionBuilderParams) => import("@duplojs/utils").MaybePromise<import("..").BuildStepSuccessEither | import("..").BuildStepNotSupportEither>;
