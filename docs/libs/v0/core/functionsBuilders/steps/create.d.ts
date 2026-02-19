import { E, type MaybePromise } from "@duplojs/utils";
import { type Steps } from "../../steps/types";
import { type Floor } from "../../floor";
import { type HookRouteLifeCycle } from "../../route";
import { type Request } from "../../request";
import { type ResponseContract, type PredictedResponse } from "../../response";
import { type Environment } from "../../types";
export type BuildedStepFunction = (request: Request, floor: Floor) => MaybePromise<Floor | PredictedResponse>;
export interface BuildStepResult {
    readonly buildedFunction: BuildedStepFunction;
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
