import { type Request } from "../request";
import { type UnionToIntersection, type AnyFunction, type Kind, type MaybePromise, type SimplifyTopLevel, type IsEqual } from "@duplojs/utils";
import { type HookResponse } from "../response";
import { type ResponseCode, type Response } from "../response";
export interface HookParamsOnConstructRequest {
    request: Request;
    addRequestProperties<GenericNewProperties extends Record<string, unknown>>(newProperties: GenericNewProperties): Request & GenericNewProperties;
}
export type HookOnConstructRequest<GenericRequest extends Request = Request> = (params: HookParamsOnConstructRequest) => MaybePromise<GenericRequest>;
export declare const hookRouteExitKind: import("@duplojs/utils").KindHandler<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/route-hook-exit", unknown>>;
export interface RouteHookExit extends Kind<typeof hookRouteExitKind.definition> {
}
export declare const hookRouteNextKind: import("@duplojs/utils").KindHandler<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/route-hook-next", unknown>>;
export interface RouteHookNext extends Kind<typeof hookRouteNextKind.definition> {
}
export interface RouteHookParams<GenericRequest extends Request = Request> {
    readonly request: GenericRequest;
    next(): RouteHookNext;
    exit(): RouteHookExit;
    response<GenericCode extends ResponseCode = ResponseCode, GenericInformation extends string = string, GenericBody extends unknown = unknown>(code: GenericCode, information: GenericInformation, body?: GenericBody): HookResponse<GenericCode, GenericInformation, GenericBody | undefined>;
}
export type HookBeforeRouteExecution<GenericRequest extends Request = Request> = (params: RouteHookParams<GenericRequest>) => MaybePromise<HookResponse | RouteHookExit | RouteHookNext>;
export interface RouteHookErrorParams<GenericRequest extends Request = Request> {
    readonly request: GenericRequest;
    readonly error: unknown;
    next(): RouteHookNext;
    exit(): RouteHookExit;
    response<GenericCode extends ResponseCode = ResponseCode, GenericInformation extends string = string, GenericBody extends unknown = unknown>(code: GenericCode, information: GenericInformation, body?: GenericBody): HookResponse<GenericCode, GenericInformation, GenericBody | undefined>;
}
export type HookError = (params: RouteHookErrorParams<Request>) => MaybePromise<HookResponse | RouteHookExit | RouteHookNext>;
export interface RouteHookParamsAfter<GenericRequest extends Request = Request> {
    readonly request: GenericRequest;
    readonly currentResponse: Response;
    next(): RouteHookNext;
    exit(): RouteHookExit;
}
export type HookBeforeSendResponse<GenericRequest extends Request = Request> = (params: RouteHookParamsAfter<GenericRequest>) => MaybePromise<RouteHookExit | RouteHookNext>;
export type HookSendResponse<GenericRequest extends Request = Request> = (params: RouteHookParamsAfter<GenericRequest>) => MaybePromise<RouteHookExit | RouteHookNext>;
export type HookAfterSendResponse<GenericRequest extends Request = Request> = (params: RouteHookParamsAfter<GenericRequest>) => MaybePromise<RouteHookExit | RouteHookNext>;
export interface HookRouteLifeCycle<GenericRequest extends Request = Request> {
    onConstructRequest?: HookOnConstructRequest<GenericRequest>;
    beforeRouteExecution?: HookBeforeRouteExecution<GenericRequest>;
    error?: HookError;
    beforeSendResponse?: HookBeforeSendResponse<GenericRequest>;
    sendResponse?: HookSendResponse<GenericRequest>;
    afterSendResponse?: HookAfterSendResponse<GenericRequest>;
}
export declare function createHookRouteLifeCycle<const GenericHookLiveCycle extends Omit<HookRouteLifeCycle<Request>, "onConstructRequest">>(hookRouteLifeCycle: GenericHookLiveCycle): GenericHookLiveCycle;
export declare function createHookRouteLifeCycle<GenericOnConstructRequest extends HookOnConstructRequest, const GenericHookLiveCycle extends Omit<HookRouteLifeCycle<Awaited<ReturnType<GenericOnConstructRequest>>>, "onConstructRequest">>(onConstructRequest: GenericOnConstructRequest, hookRouteLifeCycle: GenericHookLiveCycle): SimplifyTopLevel<{
    readonly onConstructRequest: GenericOnConstructRequest;
} & GenericHookLiveCycle>;
export type ExtractRequestFromHooks<GenericHooks extends readonly HookRouteLifeCycle[]> = GenericHooks extends readonly [
    infer InferredFirst,
    ...infer InferredRest extends HookRouteLifeCycle[]
] ? (InferredFirst extends {
    onConstructRequest: AnyFunction;
} ? Awaited<ReturnType<InferredFirst["onConstructRequest"]>> : never) extends infer InferredResultFirst ? InferredRest extends readonly [] ? InferredResultFirst : ExtractRequestFromHooks<InferredRest> extends infer InferredResultRest ? InferredResultFirst | InferredResultRest : never : never : never;
export type MakeRequestFromHooks<GenericHooks extends readonly HookRouteLifeCycle[]> = ExtractRequestFromHooks<GenericHooks> extends infer InferredResult extends Request ? IsEqual<InferredResult, never> extends true ? never : UnionToIntersection<InferredResult> : never;
