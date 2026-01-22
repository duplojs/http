import { type MakeRequestFromHooks, type HookRouteLifeCycle, type RouteDefinition, type RoutePath } from "../../route";
import { type Floor } from "../../floor";
import { type RequestMethods, type Request } from "../../request";
import { type Builder, type NeverCoalescing } from "@duplojs/utils";
import { type Metadata } from "../../metadata";
export interface RouteBuilder<GenericDefinition extends RouteDefinition = RouteDefinition, GenericFloor extends Floor = {}, GenericRequest extends Request = Request> extends Builder<RouteDefinition> {
}
export declare const routeBuilderHandler: import("@duplojs/utils").BuilderHandler<RouteBuilder<RouteDefinition, {}, Request>>;
export declare function useRouteBuilder<GenericMethod extends RequestMethods, const GenericPaths extends RoutePath | readonly [RoutePath, ...RoutePath[]], const GenericHooks extends readonly HookRouteLifeCycle[] = readonly [], const GenericMetadata extends readonly Metadata[] = readonly []>(method: GenericMethod, path: GenericPaths, options?: {
    hooks?: GenericHooks | readonly HookRouteLifeCycle[];
    metadata?: GenericMetadata;
}): RouteBuilder<{
    readonly method: GenericMethod;
    readonly paths: GenericPaths extends string ? readonly [GenericPaths] : GenericPaths;
    readonly preflightSteps: readonly [];
    readonly steps: readonly [];
    readonly hooks: GenericHooks;
    readonly metadata: GenericMetadata;
}, {}, NeverCoalescing<MakeRequestFromHooks<GenericHooks>, Request>>;
