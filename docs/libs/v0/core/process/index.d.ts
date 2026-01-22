import { type IsEqual, type Kind, type O } from "@duplojs/utils";
import { type ProcessStep, type CheckerStep, type CutStep, type ExtractStep, type stepKind, type PresetCheckerStep } from "../steps";
import { type Floor } from "../floor";
import { type HookRouteLifeCycle } from "../route";
import { type Request } from "../request";
import { type Metadata } from "../metadata";
export * from "./types";
export interface ProcessStepsCustom {
}
export type ProcessSteps = (ProcessStepsCustom[O.GetPropsWithValueExtends<ProcessStepsCustom, Kind<typeof stepKind.definition>>] | CheckerStep | ExtractStep | PresetCheckerStep | CutStep | ProcessStep);
declare const SymbolProcessExportValue: unique symbol;
declare const SymbolProcessRequest: unique symbol;
export interface ProcessDefinition {
    steps: readonly ProcessSteps[];
    options?: Record<string, unknown>;
    readonly hooks: readonly HookRouteLifeCycle[];
    readonly metadata: readonly Metadata[];
    [SymbolProcessExportValue]?: Floor;
    [SymbolProcessRequest]?: Request;
}
export interface ProcessExportValue<GenericExportValue extends Floor> {
    [SymbolProcessExportValue]: GenericExportValue;
}
export type GetProcessExportValue<GenericProcess extends Process> = IsEqual<GenericProcess["definition"][typeof SymbolProcessExportValue], unknown> extends true ? never : GenericProcess["definition"][typeof SymbolProcessExportValue];
export interface ProcessRequest<GenericRequest extends Request> {
    [SymbolProcessRequest]: GenericRequest;
}
export type GetProcessRequest<GenericProcess extends Process> = IsEqual<GenericProcess["definition"][typeof SymbolProcessRequest], unknown> extends true ? never : GenericProcess["definition"][typeof SymbolProcessRequest];
export declare const processKind: import("@duplojs/utils").KindHandler<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/process", unknown>>;
export interface Process<GenericDefinition extends ProcessDefinition = ProcessDefinition> extends Kind<typeof processKind.definition> {
    definition: GenericDefinition;
}
export declare function createProcess<GenericDefinition extends Pick<ProcessDefinition, "steps" | "options" | "hooks" | "metadata">>(definition: GenericDefinition): Process<GenericDefinition>;
