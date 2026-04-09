import { type MaybePromise, type Kind, type MaybeArray } from "@duplojs/utils";
import { type StepKind } from "./kind";
import { type Floor } from "../floor";
import { type ServerSentEventsPredictedResponse, type PredictedResponse, type ResponseContract, type PredictedResponses, type StreamPredictedResponse, type StreamTextPredictedResponse } from "../response";
import { type StepFunctionParams } from "./types";
import { type Metadata } from "../metadata";
export interface HandlerStepFunctionParamsServerSentEventsResponse<GenericResponse extends ServerSentEventsPredictedResponse> {
    serverSentEventsResponse<GenericInformation extends GenericResponse["information"], GenericFilteredResponse extends Extract<GenericResponse, {
        information: GenericInformation;
    }>>(information: GenericInformation, startSendingEvents: GenericFilteredResponse["startSendingEvents"]): GenericFilteredResponse;
}
interface HandlerStepFunctionParamsStreamResponse<GenericResponse extends StreamPredictedResponse> {
    streamResponse<GenericInformation extends GenericResponse["information"], GenericFilteredResponse extends Extract<GenericResponse, {
        information: GenericInformation;
    }>>(information: GenericInformation, startStream: GenericFilteredResponse["startStream"]): GenericFilteredResponse;
}
interface HandlerStepFunctionParamsStreamTextResponse<GenericResponse extends StreamTextPredictedResponse> {
    streamTextResponse<GenericInformation extends GenericResponse["information"], GenericFilteredResponse extends Extract<GenericResponse, {
        information: GenericInformation;
    }>>(information: GenericInformation, startStream: GenericFilteredResponse["startStream"]): GenericFilteredResponse;
}
export interface HandlerStepFunctionParams<GenericResponse extends PredictedResponses = PredictedResponses> extends StepFunctionParams<Extract<GenericResponse, PredictedResponse>>, HandlerStepFunctionParamsServerSentEventsResponse<Extract<GenericResponse, ServerSentEventsPredictedResponse>>, HandlerStepFunctionParamsStreamResponse<Extract<GenericResponse, StreamPredictedResponse>>, HandlerStepFunctionParamsStreamTextResponse<Extract<GenericResponse, StreamTextPredictedResponse>> {
}
export interface HandlerStepDefinition {
    theFunction(floor: Floor, params: HandlerStepFunctionParams): MaybePromise<PredictedResponses>;
    readonly responseContract: MaybeArray<ResponseContract.Contracts>;
    readonly metadata: readonly Metadata[];
}
export declare const handlerStepKind: import("@duplojs/utils").KindHandler<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/handler-step", unknown>>;
type _HandlerStep = (Kind<typeof handlerStepKind.definition> & StepKind);
export interface HandlerStep<GenericDefinition extends HandlerStepDefinition = HandlerStepDefinition> extends _HandlerStep {
    definition: GenericDefinition;
}
export declare function createHandlerStep<GenericDefinition extends HandlerStepDefinition>(definition: GenericDefinition): HandlerStep<GenericDefinition>;
export {};
