export declare const nodeHook: {
    beforeSendResponse({ request, currentResponse, exit }: import("../../../core/route").RouteHookParamsAfter<import("../../../core/request").Request>): import("../../../core/route").RouteHookExit;
    sendResponse({ request, currentResponse, exit }: import("../../../core/route").RouteHookParamsAfter<import("../../../core/request").Request>): Promise<import("../../../core/route").RouteHookExit>;
    afterSendResponse({ request, next }: import("../../../core/route").RouteHookParamsAfter<import("../../../core/request").Request>): Promise<import("../../../core/route").RouteHookNext>;
};
