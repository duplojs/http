import { createCoreLibKind } from "@core/kind";
import { type MaybePromise, pipe, type Kind, type MaybeArray } from "@duplojs/utils";
import { type StepKind, stepKind } from "./kind";
import { type Floor } from "@core/floor";
import { type ServerSentEventsPredictedResponse, type PredictedResponse, type ResponseContract, type PredictedResponses, type StreamPredictedResponse, type StreamTextPredictedResponse } from "@core/response";
import { type StepFunctionParams } from "./types";
import { type Metadata } from "@core/metadata";

export interface HandlerStepFunctionParamsServerSentEventsResponse<
	GenericResponse extends ServerSentEventsPredictedResponse,
> {
	serverSentEventsResponse<
		GenericInformation extends GenericResponse["information"],
		GenericFilteredResponse extends Extract<
			GenericResponse,
			{ information: GenericInformation }
		>,
	>(
		information: GenericInformation,
		startSendingEvents: GenericFilteredResponse["startSendingEvents"],
	): GenericFilteredResponse;
}

interface HandlerStepFunctionParamsStreamResponse<
	GenericResponse extends StreamPredictedResponse,
> {
	streamResponse<
		GenericInformation extends GenericResponse["information"],
		GenericFilteredResponse extends Extract<
			GenericResponse,
			{ information: GenericInformation }
		>,
	>(
		information: GenericInformation,
		startStream: GenericFilteredResponse["startStream"],
	): GenericFilteredResponse;
}

interface HandlerStepFunctionParamsStreamTextResponse<
	GenericResponse extends StreamTextPredictedResponse,
> {
	streamTextResponse<
		GenericInformation extends GenericResponse["information"],
		GenericFilteredResponse extends Extract<
			GenericResponse,
			{ information: GenericInformation }
		>,
	>(
		information: GenericInformation,
		startStreamText: GenericFilteredResponse["startStream"],
	): GenericFilteredResponse;
}

export interface HandlerStepFunctionParams<
	GenericResponse extends PredictedResponses = PredictedResponses,
> extends StepFunctionParams<
		Extract<
			GenericResponse,
			PredictedResponse
		>
	>,
	HandlerStepFunctionParamsServerSentEventsResponse<
		Extract<
			GenericResponse,
			ServerSentEventsPredictedResponse
		>
	>,
	HandlerStepFunctionParamsStreamResponse<
		Extract<
			GenericResponse,
			StreamPredictedResponse
		>
	>,
	HandlerStepFunctionParamsStreamTextResponse<
		Extract<
			GenericResponse,
			StreamTextPredictedResponse
		>
	> {

}

export interface HandlerStepDefinition {
	theFunction(
		floor: Floor,
		params: HandlerStepFunctionParams
	): MaybePromise<PredictedResponses>;
	readonly responseContract: MaybeArray<ResponseContract.Contracts>;
	readonly metadata: readonly Metadata[];
}

export const handlerStepKind = createCoreLibKind("handler-step");

type _HandlerStep = (
	& Kind<typeof handlerStepKind.definition>
	& StepKind
);

export interface HandlerStep<
	GenericDefinition extends HandlerStepDefinition = HandlerStepDefinition,
> extends _HandlerStep {
	definition: GenericDefinition;
}

export function createHandlerStep<
	GenericDefinition extends HandlerStepDefinition,
>(
	definition: GenericDefinition,
): HandlerStep<GenericDefinition> {
	return pipe(
		{ definition },
		handlerStepKind.setTo,
		stepKind.setTo,
	);
}
