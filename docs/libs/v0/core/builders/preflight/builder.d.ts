import { type Floor } from "../../floor";
import { type MakeRequestFromHooks, type HookRouteLifeCycle, type RoutePreFlightSteps } from "../../route";
import { type Builder, type NeverCoalescing } from "@duplojs/utils";
import { type Request } from "../../request";
import { type Metadata } from "../../metadata";
export interface PreflightBuilderDefinition {
    readonly preflightSteps: readonly RoutePreFlightSteps[];
    readonly hooks: readonly HookRouteLifeCycle[];
    readonly metadata: readonly Metadata[];
}
export interface PreflightBuilder<GenericDefinition extends PreflightBuilderDefinition = PreflightBuilderDefinition, GenericFloor extends Floor = {}, GenericRequest extends Request = Request> extends Builder<PreflightBuilderDefinition> {
}
export declare const preflightBuilder: import("@duplojs/utils").BuilderHandler<PreflightBuilder<PreflightBuilderDefinition, {}, Request>>;
export declare function usePreflightBuilder<const GenericHooks extends readonly HookRouteLifeCycle[] = readonly [], const GenericMetadata extends readonly Metadata[] = readonly []>(options?: {
    hooks?: GenericHooks | readonly HookRouteLifeCycle[];
    metadata?: GenericMetadata;
}): PreflightBuilder<{
    readonly preflightSteps: readonly [];
    readonly hooks: GenericHooks;
    readonly metadata: GenericMetadata;
}, {}, NeverCoalescing<MakeRequestFromHooks<GenericHooks>, Request>>;
