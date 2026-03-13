import { createCoreLibKind } from "@core/kind";
import { type MaybePromise, pipe, type Kind, type MaybeArray } from "@duplojs/utils";
import { type StepKind, stepKind } from "./kind";
import { type Floor } from "@core/floor";
import { type ServerSentEventsPredictedResponse, type PredictedResponse, type ResponseContract } from "@core/response";
import { type Request } from "@core/request";
import { type StepFunctionParams } from "./types";
import { type Metadata } from "@core/metadata";

interface HandlerStepFunctionParamsServerSentEventsResponse<
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

export interface HandlerStepFunctionParams<
	GenericRequest extends Request = Request,
	GenericResponse extends PredictedResponse | ServerSentEventsPredictedResponse
	= PredictedResponse | ServerSentEventsPredictedResponse,
> extends StepFunctionParams<
		GenericRequest,
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
	> {

}

export interface HandlerStepDefinition {
	theFunction(
		floor: Floor,
		params: HandlerStepFunctionParams
	): MaybePromise<
		| PredictedResponse
		| ServerSentEventsPredictedResponse
	>;
	readonly responseContract: MaybeArray<ResponseContract.Contract | ResponseContract.ServerSentEventsContract>;
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
