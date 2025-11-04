import { createCoreLibKind } from "@core/kind";
import { pipe, type WrappedValue, type Kind, type MaybePromise, type NeverCoalescing } from "@duplojs/utils";
import { type StepKind, stepKind } from "./kind";
import { type Floor } from "@core/floor";
import { type StepFunctionParams } from "./types";
import { type Response, type ResponseContract } from "@core/response";
import { type Request } from "@core/request";

export const cutStepOutputKind = createCoreLibKind("cut-output");

export interface CutStepFunctionOutput<
	GenericData extends Record<string, unknown> = Record<string, unknown>,
> extends Kind<typeof cutStepOutputKind.definition>, WrappedValue<GenericData> {

}

export interface CutStepFunctionParams<
	GenericRequest extends Request = Request,
	GenericResponse extends Response = Response,
> extends StepFunctionParams<GenericRequest, GenericResponse> {
	output<
		GenericData extends Record<string, unknown> = never,
	>(
		data?: GenericData,
	): CutStepFunctionOutput<
		NeverCoalescing<GenericData, {}>
	>;
}

export interface CutStepDefinition {
	theFunction(floor: Floor, params: CutStepFunctionParams): MaybePromise<CutStepFunctionOutput | Response>;
	readonly responseContract: ResponseContract.Contract | ResponseContract.Contract[];
}

export const cutStepKind = createCoreLibKind("cut-step");

export type _CutStep = (
	& Kind<typeof cutStepKind.definition>
	& StepKind
);

export interface CutStep<
	GenericDefinition extends CutStepDefinition = CutStepDefinition,
> extends _CutStep {
	definition: GenericDefinition;
}

export function createCutStep<
	GenericDefinition extends CutStepDefinition,
>(
	definition: GenericDefinition,
): CutStep<GenericDefinition> {
	return pipe(
		{ definition },
		cutStepKind.setTo,
		stepKind.setTo,
	);
}
