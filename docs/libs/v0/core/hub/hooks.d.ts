import { type Route } from "../route";
import { type EscapeVoid, type Kind, type MaybePromise } from "@duplojs/utils";
import { type Hub } from ".";
import { type RouterParams } from "../router";
import { type HttpServerParams } from "../types";
export declare const hookServerExitKind: import("@duplojs/utils").KindHandler<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/server-hook-exit", unknown>>;
export interface ServerHookExit extends Kind<typeof hookServerExitKind.definition> {
}
export declare const hookServerNextKind: import("@duplojs/utils").KindHandler<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/server-hook-next", unknown>>;
export interface ServerHookNext extends Kind<typeof hookServerNextKind.definition> {
}
export type HookBeforeBuildRoute = (route: Route) => MaybePromise<Route>;
export declare function launchHookBeforeBuildRoute(hooks: Iterable<HookBeforeBuildRoute>, route: Route): Promise<Route<import("../route").RouteDefinition>>;
export type HookBeforeServerBuildRoutes = (hub: Hub, httpServerParams: HttpServerParams) => MaybePromise<Hub | EscapeVoid>;
export type HookBeforeStartServer = (hub: Hub, httpServerParams: HttpServerParams) => MaybePromise<Hub | EscapeVoid>;
export type HookAfterStartServer = (hub: Hub, httpServerParams: HttpServerParams) => MaybePromise<Hub | EscapeVoid>;
export declare function launchHookServer(hooks: Iterable<HookBeforeStartServer | HookAfterStartServer | HookBeforeServerBuildRoutes>, hub: Hub, httpServerParams: HttpServerParams): Promise<void>;
export interface HttpServerErrorParams {
    readonly error: unknown;
    next(): ServerHookNext;
    exit(): ServerHookExit;
    routerInitializationData: RouterParams;
}
export type HookServerError = (httpServerErrorParams: HttpServerErrorParams) => MaybePromise<ServerHookExit | ServerHookNext>;
export declare function serverErrorExitHookFunction(): Kind<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/server-hook-exit", unknown>, unknown>;
export declare function serverErrorNextHookFunction(): Kind<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/server-hook-next", unknown>, unknown>;
export declare function launchHookServerError(hooks: readonly HookServerError[], params: HttpServerErrorParams): Promise<void>;
export interface HookHubLifeCycle {
    beforeBuildRoute?: HookBeforeBuildRoute;
    beforeStartServer?: HookBeforeStartServer;
    afterStartServer?: HookAfterStartServer;
    beforeServerBuildRoutes?: HookBeforeServerBuildRoutes;
    serverError?: HookServerError;
}
export declare function createHookHubLifeCycle(hookHubLifeCycle: HookHubLifeCycle): HookHubLifeCycle;
