import { type Floor } from "../../floor";
import { type HookRouteLifeCycle, type RoutePreFlightSteps } from "../../route";
import { type Builder } from "@duplojs/utils";
import { type Metadata } from "../../metadata";
export interface PreflightBuilderDefinition {
    readonly preflightSteps: readonly RoutePreFlightSteps[];
    readonly hooks: readonly HookRouteLifeCycle[];
    readonly metadata: readonly Metadata[];
}
export interface PreflightBuilder<GenericDefinition extends PreflightBuilderDefinition = PreflightBuilderDefinition, GenericFloor extends Floor = {}> extends Builder<PreflightBuilderDefinition> {
}
export declare const preflightBuilder: import("@duplojs/utils").BuilderHandler<PreflightBuilder<PreflightBuilderDefinition, {}>>;
export declare function usePreflightBuilder<const GenericHooks extends readonly HookRouteLifeCycle[] = readonly [], const GenericMetadata extends readonly Metadata[] = readonly []>(options?: {
    hooks?: GenericHooks | readonly HookRouteLifeCycle[];
    metadata?: GenericMetadata;
}): PreflightBuilder<{
    readonly preflightSteps: readonly [];
    readonly hooks: GenericHooks;
    readonly metadata: GenericMetadata;
}, {}>;
