import { type Kind } from "@duplojs/utils";
import { type StepKind } from "./kind";
import { type Process } from "../process";
import { type Metadata } from "../metadata";
export interface ProcessStepDefinition {
    readonly process: Process;
    readonly options?: Record<string, unknown> | ((input: any) => Record<string, unknown>);
    readonly imports?: readonly string[];
    readonly metadata: readonly Metadata[];
}
export declare const processStepKind: import("@duplojs/utils").KindHandler<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/process-step", unknown>>;
export type _ProcessStep = (Kind<typeof processStepKind.definition> & StepKind);
export interface ProcessStep<GenericDefinition extends ProcessStepDefinition = ProcessStepDefinition> extends _ProcessStep {
    definition: GenericDefinition;
}
export declare function createProcessStep<GenericDefinition extends ProcessStepDefinition>(definition: GenericDefinition): ProcessStep<GenericDefinition>;
