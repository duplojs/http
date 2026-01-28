import { type Kind } from "@duplojs/utils";
import { type StepKind } from "./kind";
import { type Floor } from "../floor";
import { type PresetChecker } from "../presetChecker";
import { type Metadata } from "../metadata";
export interface PresetCheckerStepDefinition {
    readonly presetChecker: PresetChecker;
    input(input: Floor): unknown;
    readonly metadata: readonly Metadata[];
}
export declare const presetCheckerStepKind: import("@duplojs/utils").KindHandler<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/presetChecker-step", unknown>>;
export type _PresetCheckerStep = (Kind<typeof presetCheckerStepKind.definition> & StepKind);
export interface PresetCheckerStep<GenericDefinition extends PresetCheckerStepDefinition = PresetCheckerStepDefinition> extends _PresetCheckerStep {
    readonly definition: GenericDefinition;
}
export declare function createPresetCheckerStep<GenericDefinition extends PresetCheckerStepDefinition>(definition: GenericDefinition): PresetCheckerStep<GenericDefinition>;
