import { type WrappedValue, type Kind, type MaybePromise, type NeverCoalescing, type MaybeArray } from "@duplojs/utils";
import { type StepKind } from "./kind";
import { type Floor } from "../floor";
import { type StepFunctionParams } from "./types";
import { type PredictedResponse, type ResponseContract } from "../response";
import { type Request } from "../request";
import { type Metadata } from "../metadata";
export declare const cutStepOutputKind: import("@duplojs/utils").KindHandler<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/cut-output", unknown>>;
export interface CutStepFunctionOutput<GenericData extends Record<string, unknown> = Record<string, unknown>> extends Kind<typeof cutStepOutputKind.definition>, WrappedValue<GenericData> {
}
export interface CutStepFunctionParams<GenericRequest extends Request = Request, GenericResponse extends PredictedResponse = PredictedResponse> extends StepFunctionParams<GenericRequest, GenericResponse> {
    output<GenericData extends Record<string, unknown> = never>(data?: GenericData): CutStepFunctionOutput<NeverCoalescing<GenericData, {}>>;
}
export interface CutStepDefinition {
    theFunction(floor: Floor, params: CutStepFunctionParams): MaybePromise<CutStepFunctionOutput | PredictedResponse>;
    readonly responseContract: MaybeArray<ResponseContract.Contract>;
    readonly metadata: readonly Metadata[];
}
export declare const cutStepKind: import("@duplojs/utils").KindHandler<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/cut-step", unknown>>;
export type _CutStep = (Kind<typeof cutStepKind.definition> & StepKind);
export interface CutStep<GenericDefinition extends CutStepDefinition = CutStepDefinition> extends _CutStep {
    definition: GenericDefinition;
}
export declare function createCutStep<GenericDefinition extends CutStepDefinition>(definition: GenericDefinition): CutStep<GenericDefinition>;
