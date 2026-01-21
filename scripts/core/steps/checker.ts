import { createCoreLibKind } from "@core/kind";
import { pipe, type Kind } from "@duplojs/utils";
import { type StepKind, stepKind } from "./kind";
import { type Checker } from "@core/checker";
import { type Floor } from "@core/floor";
import { type ClientErrorResponseCode, type ResponseContract } from "@core/response";
import { type Metadata } from "@core/metadata";

export interface CheckerStepDefinition {
	readonly checker: Checker;
	readonly result: string | readonly string[];
	readonly indexing?: string;
	input(input: Floor): unknown;
	readonly options?: Record<string, unknown> | ((input: any) => Record<string, unknown>);
	readonly responseContract: ResponseContract.Contract<ClientErrorResponseCode>;
	readonly metadata: readonly Metadata[];
}

export const checkerStepKind = createCoreLibKind("checker-step");

export type _CheckerStep = (
	& Kind<typeof checkerStepKind.definition>
	& StepKind
);

export interface CheckerStep<
	GenericDefinition extends CheckerStepDefinition = CheckerStepDefinition,
> extends _CheckerStep {
	readonly definition: GenericDefinition;
}

export function createCheckerStep<
	GenericDefinition extends CheckerStepDefinition,
>(
	definition: GenericDefinition,
): CheckerStep<GenericDefinition> {
	return pipe(
		{ definition },
		checkerStepKind.setTo,
		stepKind.setTo,
	);
}
