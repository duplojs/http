import { createCoreLibKind } from "@core/kind";
import { type MaybePromise, pipe, type Kind } from "@duplojs/utils";
import { type StepKind, stepKind } from "./kind";
import { type Floor } from "@core/floor";
import { type PredictedResponse, type ResponseContract } from "@core/response";
import { type Request } from "@core/request";
import { type StepFunctionParams } from "./types";
import { type Metadata } from "@core/metadata";

export interface HandlerStepFunctionParams<
	GenericRequest extends Request = Request,
	GenericResponse extends PredictedResponse = PredictedResponse,
> extends StepFunctionParams<GenericRequest, GenericResponse> {}

export interface HandlerStepDefinition {
	theFunction(floor: Floor, params: HandlerStepFunctionParams): MaybePromise<PredictedResponse>;
	readonly responseContract: ResponseContract.Contract | readonly ResponseContract.Contract[];
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
