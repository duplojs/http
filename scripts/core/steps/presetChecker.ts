import { createCoreLibKind } from "@core/kind";
import { pipe, type Kind } from "@duplojs/utils";
import { type StepKind, stepKind } from "./kind";
import { type Floor } from "@core/floor";
import { type PresetChecker } from "@core/presetChecker";
import { type Metadata } from "@core/metadata";

export interface PresetCheckerStepDefinition {
	readonly presetChecker: PresetChecker;
	input(input: Floor): unknown;
	readonly metadata: readonly Metadata[];

}

export const presetCheckerStepKind = createCoreLibKind("presetChecker-step");

export type _PresetCheckerStep = (
	& Kind<typeof presetCheckerStepKind.definition>
	& StepKind
);

export interface PresetCheckerStep<
	GenericDefinition extends PresetCheckerStepDefinition = PresetCheckerStepDefinition,
> extends _PresetCheckerStep {
	readonly definition: GenericDefinition;
}

export function createPresetCheckerStep<
	GenericDefinition extends PresetCheckerStepDefinition,
>(
	definition: GenericDefinition,
): PresetCheckerStep<GenericDefinition> {
	return pipe(
		{ definition },
		presetCheckerStepKind.setTo,
		stepKind.setTo,
	);
}
