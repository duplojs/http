import { type HookRouteLifeCycle, type RouteDefinition, type RoutePath } from "../../route";
import { type Floor } from "../../floor";
import { type RequestMethods, type BodyController } from "../../request";
import { type Builder } from "@duplojs/utils";
import { type Metadata } from "../../metadata";
export interface RouteBuilder<GenericDefinition extends RouteDefinition = RouteDefinition, GenericFloor extends Floor = {}> extends Builder<RouteDefinition> {
}
export declare const routeBuilderHandler: import("@duplojs/utils").BuilderHandler<RouteBuilder<RouteDefinition, {}>>;
export declare function useRouteBuilder<GenericMethod extends RequestMethods, const GenericPaths extends RoutePath | readonly [RoutePath, ...RoutePath[]], const GenericHooks extends readonly HookRouteLifeCycle[] = readonly [], const GenericMetadata extends readonly Metadata[] = readonly [], const GenericBodyController extends BodyController | null = null>(method: GenericMethod, path: GenericPaths, options?: {
    hooks?: GenericHooks | readonly HookRouteLifeCycle[];
    metadata?: GenericMetadata;
    bodyController?: GenericBodyController;
}): RouteBuilder<{
    readonly method: GenericMethod;
    readonly paths: GenericPaths extends string ? readonly [GenericPaths] : GenericPaths;
    readonly preflightSteps: readonly [];
    readonly steps: readonly [];
    readonly hooks: GenericHooks;
    readonly metadata: GenericMetadata;
    readonly bodyController: GenericBodyController;
}, {}>;
