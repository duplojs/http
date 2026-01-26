import { type HttpServerParams, type Hub } from "../../core/hub";
import { HookResponse } from "../../core/response";
export declare function makeNodeHook(hub: Hub, serverParams: HttpServerParams): {
    parseBody({ request, exit }: import("../../core/route").RouteHookParams<import("../../core/request").Request>): Promise<import("../../core/route").RouteHookExit>;
    error({ error, response, exit }: import("../../core/route").RouteHookErrorParams<import("../../core/request").Request>): import("../../core/route").RouteHookExit | HookResponse<"400", "body-size-exceeds-limit-error", unknown> | HookResponse<"400", "body-parse-wrong-chunk-received", unknown> | HookResponse<"400", "body-parse-unknown-error", unknown>;
    beforeSendResponse({ request, currentResponse, exit }: import("../../core/route").RouteHookParamsAfter<import("../../core/request").Request>): import("../../core/route").RouteHookExit;
    sendResponse({ request, currentResponse, exit }: import("../../core/route").RouteHookParamsAfter<import("../../core/request").Request>): import("../../core/route").RouteHookExit;
};
