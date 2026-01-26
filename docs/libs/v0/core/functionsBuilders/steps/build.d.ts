import { type Steps } from "../../steps/types";
import { type BuildStepNotSupportEither, type createStepFunctionBuilder } from "./create";
import { type Environment } from "../../types";
import { type ResponseContract } from "../../response";
export interface BuildStepFunctionParams {
    readonly stepFunctionBuilders: readonly ReturnType<typeof createStepFunctionBuilder>[];
    readonly environment: Environment;
    readonly defaultExtractContract: ResponseContract.Contract;
}
export declare function buildStepFunction(step: Steps, params: BuildStepFunctionParams): Promise<import("./create").BuildStepSuccessEither | BuildStepNotSupportEither>;
