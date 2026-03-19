import { type Hub } from "./hub";
import { type RouterParams } from "./router";
import { type AnyTuple, type MaybePromise } from "@duplojs/utils";
import { type HttpServerParams } from "./types";
import { type HookRouteLifeCycle } from "./route";
export interface GetInterfaceHooksParams {
    readonly hub: Hub;
    readonly httpServerParams: HttpServerParams;
}
export interface ImplementHttpServerParams {
    readonly hub: Hub;
    readonly httpServerParams: HttpServerParams;
    getInterfaceHooks(params: GetInterfaceHooksParams): AnyTuple<HookRouteLifeCycle>;
}
export type ExecRouteSystem = (routerInitializationData: RouterParams, whenUncaughtError: (error: unknown, routerInitializationData: RouterParams) => MaybePromise<void>) => Promise<void>;
export interface InitHttpServerParams {
    readonly execRouteSystem: ExecRouteSystem;
    readonly httpServerParams: HttpServerParams;
}
export declare function implementHttpServer<GenericServer extends unknown>(params: ImplementHttpServerParams, initHttpServer: (params: InitHttpServerParams) => MaybePromise<GenericServer>): Promise<GenericServer>;
