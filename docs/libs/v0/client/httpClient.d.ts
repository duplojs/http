import { type Kind, type MayBeGetter, type SimplifyTopLevel, type IsEqual } from "@duplojs/utils";
import { type ClientRequestInitParams, type ServerRoute, type ServerRouteToClientRequestParams, type ServerRouteToClientResponse, type ClientRequestParams, type ClientResponse, type Hooks, type RequestHook, type ResponseHook, type InformationHook, type CodeHook, type ResponseTypeHook, type ExpectedResponseHook, type NotPredictedResponseHook, type ErrorHook, type GetServerRoutePath } from "./types";
import { PromiseRequest } from "./promiseRequest";
export declare const httpClientKind: import("@duplojs/utils").KindHandler<import("@duplojs/utils").KindDefinition<"@DuplojsHttpClient/http-client", unknown>>;
type MaybeRequestParams<GenericRequestParams extends object> = {} extends GenericRequestParams ? [params?: GenericRequestParams] : [params: GenericRequestParams];
type HttpClientRequestMethod<GenericServerRoute extends ServerRoute, GenericHookParams extends Record<string, unknown>, GenericMethod extends string> = IsEqual<GenericServerRoute, ServerRoute> extends true ? (path: string, params?: SimplifyTopLevel<Omit<ClientRequestParams<GenericHookParams>, "method" | "path">>) => PromiseRequest<GenericHookParams, ClientResponse<GenericHookParams>> : <GenericPath extends Extract<GenericServerRoute, {
    method: GenericMethod;
}>["path"], GenericMatchedPath extends GetServerRoutePath<Extract<GenericServerRoute, {
    method: GenericMethod;
}>, GenericPath>>(path: GenericPath, ...args: MaybeRequestParams<SimplifyTopLevel<Omit<ServerRouteToClientRequestParams<Extract<GenericServerRoute, {
    method: GenericMethod;
    path: GenericMatchedPath | GenericPath;
}>, GenericHookParams>, "method" | "path">>>) => PromiseRequest<GenericHookParams, ServerRouteToClientResponse<Extract<GenericServerRoute, {
    method: GenericMethod;
    path: GenericMatchedPath;
}>, GenericHookParams>>;
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
    addRequestHook(hook: RequestHook<GenericHookParams>): void;
    addResponseHook(hook: ResponseHook<GenericHookParams>): void;
    addInformationHook(information: string, hook: InformationHook<GenericHookParams>): void;
    addCodeHook(code: string, hook: CodeHook<GenericHookParams>): void;
    addInformationalResponseTypeHook(hook: ResponseTypeHook<GenericHookParams>): void;
    addSuccessfulResponseTypeHook(hook: ResponseTypeHook<GenericHookParams>): void;
    addRedirectionResponseTypeHook(hook: ResponseTypeHook<GenericHookParams>): void;
    addClientErrorResponseTypeHook(hook: ResponseTypeHook<GenericHookParams>): void;
    addServerErrorResponseTypeHook(hook: ResponseTypeHook<GenericHookParams>): void;
    addExpectedResponseHook(hook: ExpectedResponseHook<GenericHookParams>): void;
    addNotPredictedResponseHook(hook: NotPredictedResponseHook<GenericHookParams>): void;
    addErrorHook(hook: ErrorHook<GenericHookParams>): void;
    request<GenericClientRequestParams extends ServerRouteToClientRequestParams<GenericServerRoute, GenericHookParams>, GenericMatchedPath extends GetServerRoutePath<Extract<GenericServerRoute, {
        method: GenericClientRequestParams["method"];
    }>, GenericClientRequestParams["path"]>>(params: GenericClientRequestParams): PromiseRequest<GenericHookParams, ServerRouteToClientResponse<Extract<GenericServerRoute, {
        method: GenericClientRequestParams["method"];
        path: GenericMatchedPath;
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
export declare function createHttpClient<GenericServerRoute extends ServerRoute = ServerRoute, GenericHookParams extends Record<string, unknown> = Record<string, unknown>>(clientParams: CreateHttpClientParams): HttpClient<GenericServerRoute, GenericHookParams>;
export {};
