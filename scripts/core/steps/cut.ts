import { createCoreLibKind } from "@core/kind";
import { pipe, type WrappedValue, type Kind, type MaybePromise, type NeverCoalescing, type MaybeArray } from "@duplojs/utils";
import { type StepKind, stepKind } from "./kind";
import { type Floor } from "@core/floor";
import { type StepFunctionParams } from "./types";
import { type PredictedResponse, type ResponseContract } from "@core/response";
import { type Metadata } from "@core/metadata";

export const cutStepOutputKind = createCoreLibKind("cut-output");

export interface CutStepFunctionOutput<
	GenericData extends Record<string, unknown> = Record<string, unknown>,
> extends Kind<typeof cutStepOutputKind.definition>, WrappedValue<GenericData> {

}

export interface CutStepFunctionParams<
	GenericResponse extends PredictedResponse = PredictedResponse,
> extends StepFunctionParams<GenericResponse> {
	output<
		GenericData extends Record<string, unknown> = never,
	>(
		data?: GenericData,
	): CutStepFunctionOutput<
		NeverCoalescing<GenericData, {}>
	>;
}

export interface CutStepDefinition {
	theFunction(floor: Floor, params: CutStepFunctionParams): MaybePromise<CutStepFunctionOutput | PredictedResponse>;
	readonly responseContract: MaybeArray<ResponseContract.Contract>;
	readonly metadata: readonly Metadata[];
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
