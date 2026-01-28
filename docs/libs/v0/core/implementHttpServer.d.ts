import { type Hub, type HttpServerParams } from "./hub";
import { type RouterInitializationData } from "./router";
import { type MaybePromise } from "@duplojs/utils";
export interface ImplementHttpServerParams {
    readonly hub: Hub;
    readonly httpServerParams: HttpServerParams;
}
export type ExecRouteSystem = (routerInitializationData: RouterInitializationData, whenUncaughtError: (error: unknown, routerInitializationData: RouterInitializationData) => MaybePromise<void>) => Promise<void>;
export interface InitHttpServerParams {
    readonly execRouteSystem: ExecRouteSystem;
    readonly httpServerParams: HttpServerParams;
}
export declare function implementHttpServer<GenericServer extends unknown>(params: ImplementHttpServerParams, initHttpServer: (params: InitHttpServerParams) => MaybePromise<GenericServer>): Promise<GenericServer>;
