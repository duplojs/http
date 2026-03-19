import type { CacheControlDirectives } from "./types";
export declare function createCacheControllerHooks(params?: CacheControlDirectives): {
    readonly beforeSendResponse: ({ currentResponse, next }: import("../../core/route").RouteHookParamsAfter) => import("../../core/route").RouteHookNext;
};
