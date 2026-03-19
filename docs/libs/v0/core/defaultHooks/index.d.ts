import { type Hub } from "../hub";
import { type HttpServerParams } from "../types";
export declare function initDefaultHook(hub: Hub, serverParams: HttpServerParams): {
    readonly beforeSendResponse: ({ currentResponse, next }: import("../route").RouteHookParamsAfter) => import("../route").RouteHookNext;
};
