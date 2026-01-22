import { type MaybePromise, type Kind } from "@duplojs/utils";
import { type StepKind } from "./kind";
import { type Floor } from "../floor";
import { type PredictedResponse, type ResponseContract } from "../response";
import { type Request } from "../request";
import { type StepFunctionParams } from "./types";
import { type Metadata } from "../metadata";
export interface HandlerStepFunctionParams<GenericRequest extends Request = Request, GenericResponse extends PredictedResponse = PredictedResponse> extends StepFunctionParams<GenericRequest, GenericResponse> {
}
export interface HandlerStepDefinition {
    theFunction(floor: Floor, params: HandlerStepFunctionParams): MaybePromise<PredictedResponse>;
    readonly responseContract: ResponseContract.Contract | readonly ResponseContract.Contract[];
    readonly metadata: readonly Metadata[];
}
export declare const handlerStepKind: import("@duplojs/utils").KindHandler<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/handler-step", unknown>>;
type _HandlerStep = (Kind<typeof handlerStepKind.definition> & StepKind);
export interface HandlerStep<GenericDefinition extends HandlerStepDefinition = HandlerStepDefinition> extends _HandlerStep {
    definition: GenericDefinition;
}
export declare function createHandlerStep<GenericDefinition extends HandlerStepDefinition>(definition: GenericDefinition): HandlerStep<GenericDefinition>;
export {};
