import { type ProcessDefinition } from "../../process";
import { type Floor } from "../../floor";
import { type Builder, type IsEqual, type NeverCoalescing } from "@duplojs/utils";
import { type HookRouteLifeCycle } from "../../route";
import { type Metadata } from "../../metadata";
export interface ProcessBuilder<GenericDefinition extends ProcessDefinition = ProcessDefinition, GenericFloor extends Floor = {}> extends Builder<ProcessDefinition> {
}
export declare const processBuilder: import("@duplojs/utils").BuilderHandler<ProcessBuilder<ProcessDefinition, {}>>;
export declare function useProcessBuilder<GenericOptions extends ProcessDefinition["options"] = never, const GenericHooks extends readonly HookRouteLifeCycle[] = readonly [], const GenericMetadata extends readonly Metadata[] = readonly []>(params?: {
    options?: GenericOptions;
    hooks?: GenericHooks | readonly HookRouteLifeCycle[];
    metadata?: GenericMetadata;
}): ProcessBuilder<{
    readonly steps: readonly [];
    readonly options: NeverCoalescing<GenericOptions, undefined>;
    readonly hooks: GenericHooks;
    readonly metadata: GenericMetadata;
}, IsEqual<GenericOptions, never> extends true ? {} : {
    options: GenericOptions;
}>;
