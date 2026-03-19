import { type Request } from "../request";
import { type Kind, type MaybePromise } from "@duplojs/utils";
import { type HookResponse } from "../response";
import { type ResponseCode, type Response } from "../response";
export declare const hookRouteExitKind: import("@duplojs/utils").KindHandler<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/route-hook-exit", unknown>>;
export interface RouteHookExit extends Kind<typeof hookRouteExitKind.definition> {
}
export declare const hookRouteNextKind: import("@duplojs/utils").KindHandler<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/route-hook-next", unknown>>;
export interface RouteHookNext extends Kind<typeof hookRouteNextKind.definition> {
}
export interface RouteHookParams {
    readonly request: Request;
    next(): RouteHookNext;
    exit(): RouteHookExit;
    response<GenericCode extends ResponseCode = ResponseCode, GenericInformation extends string = string, GenericBody extends unknown = unknown>(code: GenericCode, information: GenericInformation, body?: GenericBody): HookResponse<GenericCode, GenericInformation, GenericBody | undefined>;
}
export type HookBeforeRouteExecution = (params: RouteHookParams) => MaybePromise<HookResponse | RouteHookExit | RouteHookNext>;
export interface RouteHookErrorParams<GenericRequest extends Request = Request> {
    readonly request: GenericRequest;
    readonly error: unknown;
    next(): RouteHookNext;
    exit(): RouteHookExit;
    response<GenericCode extends ResponseCode = ResponseCode, GenericInformation extends string = string, GenericBody extends unknown = unknown>(code: GenericCode, information: GenericInformation, body?: GenericBody): HookResponse<GenericCode, GenericInformation, GenericBody | undefined>;
}
export type HookError = (params: RouteHookErrorParams<Request>) => MaybePromise<HookResponse | RouteHookExit | RouteHookNext>;
export interface RouteHookParamsAfter {
    readonly request: Request;
    readonly currentResponse: Response;
    next(): RouteHookNext;
    exit(): RouteHookExit;
}
export type HookBeforeSendResponse = (params: RouteHookParamsAfter) => MaybePromise<RouteHookExit | RouteHookNext>;
export type HookSendResponse = (params: RouteHookParamsAfter) => MaybePromise<RouteHookExit | RouteHookNext>;
export type HookAfterSendResponse = (params: RouteHookParamsAfter) => MaybePromise<RouteHookExit | RouteHookNext>;
export interface HookRouteLifeCycle {
    beforeRouteExecution?: HookBeforeRouteExecution;
    error?: HookError;
    beforeSendResponse?: HookBeforeSendResponse;
    sendResponse?: HookSendResponse;
    afterSendResponse?: HookAfterSendResponse;
}
export declare function createHookRouteLifeCycle<const GenericHookLiveCycle extends HookRouteLifeCycle>(hookRouteLifeCycle: GenericHookLiveCycle): GenericHookLiveCycle;
