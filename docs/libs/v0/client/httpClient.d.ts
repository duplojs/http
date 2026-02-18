import { type Kind, type MayBeGetter, type NeverCoalescing, type SimplifyTopLevel } from "@duplojs/utils";
import { type ClientRequestInitParams, type ServerRoute, type ServerRouteToClientRequestParams, type ServerRouteToClientResponse, type ClientRequestParams } from "./types";
import { PromiseRequest, type PromiseRequestParams } from "./promiseRequest";
import { type Hooks, type RequestHook, type ResponseHook, type InformationHook, type CodeHook, type ResponseTypeHook, type ExpectedResponseHook, type ErrorHook, type NotPredictedResponseHook } from "./hooks";
export declare const httpClientKind: import("@duplojs/utils").KindHandler<import("@duplojs/utils").KindDefinition<"@DuplojsHttpClient/http-client", unknown>>;
type MaybeRequestParams<GenericRequestParams extends object> = {} extends GenericRequestParams ? [params?: NoInfer<GenericRequestParams>] : [params: NoInfer<GenericRequestParams>];
type HttpClientRequestMethod<GenericServerRoute extends ServerRoute, GenericHookParams extends Record<string, unknown>, GenericMethod extends string> = <GenericClientRequestParams extends NeverCoalescing<ServerRouteToClientRequestParams<Extract<GenericServerRoute, {
    method: GenericMethod;
}>, GenericHookParams>, ClientRequestParams<GenericHookParams>>, GenericPath extends GenericClientRequestParams["path"], GenericClientRequestRest extends SimplifyTopLevel<Omit<NeverCoalescing<Extract<GenericClientRequestParams, {
    path: GenericPath;
}>, ClientRequestParams<GenericHookParams>>, "method" | "path">>>(path: GenericPath, ...args: MaybeRequestParams<GenericClientRequestRest>) => PromiseRequest<PromiseRequestParams<GenericHookParams>, ServerRouteToClientResponse<NeverCoalescing<Extract<GenericServerRoute, {
    method: GenericMethod;
    path: GenericPath;
}>, ServerRoute>, GenericHookParams>>;
export interface HttpClientConfig {
    readonly baseUrl: string;
    readonly informationHeaderKey: string;
    readonly predictedHeaderKey: string;
    readonly disabledPredictedMode: boolean;
    readonly credentials?: ClientRequestInitParams["credentials"];
    readonly cache?: ClientRequestInitParams["cache"];
}
export interface HttpClient<GenericServerRoute extends ServerRoute = ServerRoute, GenericHookParams extends Record<string, unknown> = Record<string, unknown>> extends Kind<typeof httpClientKind.definition> {
    readonly config: HttpClientConfig;
    readonly hooks: Hooks;
    readonly defaultHeaders: Map<string, () => (string | undefined | null)>;
    addDefaultHeader(headerName: string, headerValue: MayBeGetter<string | undefined | null>): void;
    addDefaultHeaders(headers: Record<string, MayBeGetter<string | undefined | null>>): void;
    addRequestHook(hook: RequestHook<PromiseRequestParams<GenericHookParams>>): void;
    addResponseHook(hook: ResponseHook<PromiseRequestParams<GenericHookParams>>): void;
    addInformationHook(information: string, hook: InformationHook<PromiseRequestParams<GenericHookParams>>): void;
    addCodeHook(code: string, hook: CodeHook<PromiseRequestParams<GenericHookParams>>): void;
    addInformationalResponseTypeHook(hook: ResponseTypeHook<PromiseRequestParams<GenericHookParams>>): void;
    addSuccessfulResponseTypeHook(hook: ResponseTypeHook<PromiseRequestParams<GenericHookParams>>): void;
    addRedirectionResponseTypeHook(hook: ResponseTypeHook<PromiseRequestParams<GenericHookParams>>): void;
    addClientErrorResponseTypeHook(hook: ResponseTypeHook<PromiseRequestParams<GenericHookParams>>): void;
    addServerErrorResponseTypeHook(hook: ResponseTypeHook<PromiseRequestParams<GenericHookParams>>): void;
    addExpectedResponseHook(hook: ExpectedResponseHook<PromiseRequestParams<GenericHookParams>>): void;
    addNotPredictedResponseHook(hook: NotPredictedResponseHook<PromiseRequestParams<GenericHookParams>>): void;
    addErrorHook(hook: ErrorHook<PromiseRequestParams<GenericHookParams>>): void;
    request<GenericClientRequestParams extends ServerRouteToClientRequestParams<GenericServerRoute, GenericHookParams>>(params: GenericClientRequestParams): PromiseRequest<PromiseRequestParams<GenericHookParams>, ServerRouteToClientResponse<Extract<GenericServerRoute, {
        method: GenericClientRequestParams["method"];
        path: GenericClientRequestParams["path"];
    }>, GenericHookParams>>;
    get: HttpClientRequestMethod<GenericServerRoute, GenericHookParams, "GET">;
    post: HttpClientRequestMethod<GenericServerRoute, GenericHookParams, "POST">;
    put: HttpClientRequestMethod<GenericServerRoute, GenericHookParams, "PUT">;
    patch: HttpClientRequestMethod<GenericServerRoute, GenericHookParams, "PATCH">;
    delete: HttpClientRequestMethod<GenericServerRoute, GenericHookParams, "DELETE">;
}
export interface CreateHttpClientParams {
    readonly baseUrl: string;
    readonly hooks?: Partial<Hooks>;
    readonly credentials?: ClientRequestInitParams["credentials"];
    readonly cache?: ClientRequestInitParams["cache"];
    readonly informationHeaderKey?: string;
    readonly predictedHeaderKey?: string;
    readonly disabledPredictedMode?: boolean;
}
export declare function createHttpClient<GenericServerRoute extends ServerRoute = never, GenericHookParams extends Record<string, unknown> = Record<string, unknown>>(clientParams: CreateHttpClientParams): HttpClient<NeverCoalescing<GenericServerRoute, ServerRoute>, GenericHookParams>;
export {};
