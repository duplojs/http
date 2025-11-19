import { createCoreLibKind } from "@core/kind";
import { pipe, type Kind } from "@duplojs/utils";
import { type StepKind, stepKind } from "./kind";
import { type Process } from "@core/process";
import { type Floor } from "@core/floor";

export interface ProcessStepDefinition {
	readonly process: Process;
	readonly options?: Record<string, unknown> | ((input: any) => Record<string, unknown>);
	readonly imports?: readonly string[];
}

export const processStepKind = createCoreLibKind("process-step");

export type _ProcessStep = (
	& Kind<typeof processStepKind.definition>
	& StepKind
);

export interface ProcessStep<
	GenericDefinition extends ProcessStepDefinition = ProcessStepDefinition,
> extends _ProcessStep {
	definition: GenericDefinition;
}

export function createProcessStep<
	GenericDefinition extends ProcessStepDefinition,
>(
	definition: GenericDefinition,
): ProcessStep<GenericDefinition> {
	return pipe(
		{ definition },
		processStepKind.setTo,
		stepKind.setTo,
	);
}
