import { type SimplifyTopLevel, type IsEqual, type MaybeArray, type AnyTuple } from "@duplojs/utils";
import { type ServerRouteHeaders, type ServerRouteParams, type ServerRouteQuery, type ServerRoute, type ServerPrimitiveData } from "./serverRoute";
import { type ObjectCanBeEmpty } from "./ObjectCanBeEmpty";
import type * as OO from "@duplojs/utils/object";
import { type CreateClientCacheKey } from "./clientCache";
export interface ClientRequestInitParams extends Pick<RequestInit, "cache" | "credentials" | "integrity" | "keepalive" | "mode" | "redirect" | "referrer" | "referrerPolicy" | "signal"> {
}
export type ClientRequestParamsHeaders = Record<string, string | undefined | {
    toString(): string;
}>;
export type ClientRequestParamsParams = Record<string, string | undefined | {
    toString(): string;
}>;
export type ClientRequestParamsQuery = Record<string, MaybeArray<string | {
    toString(): string;
}> | undefined>;
export type ClientRequestParamsBody = unknown;
export interface ClientRequestParams<GenericHookParams extends Record<string, unknown> = Record<string, unknown>> {
    method: string;
    path: string;
    headers?: ClientRequestParamsHeaders;
    params?: ClientRequestParamsParams;
    query?: ClientRequestParamsQuery;
    body?: ClientRequestParamsBody;
    abortController?: AbortController;
    initParams?: ClientRequestInitParams;
    hookParams?: GenericHookParams;
    clientCache?: "auto" | CreateClientCacheKey<GenericHookParams>;
    bypassClientCache?: boolean;
    refreshClientCache?: boolean;
}
type StringifyTuple<GenericTuple extends AnyTuple<ServerPrimitiveData>> = GenericTuple extends [
    infer InferredFirst extends ServerPrimitiveData,
    ...infer InferredRest
] ? InferredRest extends readonly [] ? [`${InferredFirst}`] : InferredRest extends AnyTuple ? StringifyTuple<InferredRest> extends infer InferredResult extends AnyTuple ? [`${InferredFirst}`, ...InferredResult] : never : never : never;
export type ServerRouteToClientRequestParamsHeaders<GenericHeader extends ServerRouteHeaders | undefined> = GenericHeader extends ServerRouteHeaders ? SimplifyTopLevel<{
    [Prop in keyof GenericHeader]: GenericHeader[Prop] extends infer InferredValue ? InferredValue extends ServerPrimitiveData ? InferredValue extends undefined ? InferredValue : `${InferredValue}` : never : never;
}> : GenericHeader;
export type ServerRouteToClientRequestParamsParams<GenericParams extends ServerRouteParams | undefined> = GenericParams extends ServerRouteParams ? SimplifyTopLevel<{
    [Prop in keyof GenericParams]: GenericParams[Prop] extends infer InferredValue ? InferredValue extends ServerPrimitiveData ? InferredValue extends undefined ? InferredValue : `${InferredValue}` : never : never;
}> : GenericParams;
export type ServerRouteToClientRequestParamsQuery<GenericQuery extends ServerRouteQuery | undefined> = GenericQuery extends ServerRouteQuery ? SimplifyTopLevel<{
    [Prop in keyof GenericQuery]: GenericQuery[Prop] extends infer InferredValue ? InferredValue extends MaybeArray<ServerPrimitiveData> ? InferredValue extends undefined ? InferredValue : InferredValue extends AnyTuple ? StringifyTuple<InferredValue> : InferredValue extends readonly any[] ? `${InferredValue[number]}`[] : InferredValue extends ServerPrimitiveData ? `${InferredValue}` : never : never : never;
}> : GenericQuery;
type MaybeParams<GenericParams extends object> = {
    [Prop in keyof GenericParams]-?: undefined extends GenericParams[Prop] ? Prop : GenericParams[Prop] extends object ? ObjectCanBeEmpty<GenericParams[Prop]> extends true ? Prop : never : never;
}[keyof GenericParams] extends infer InferredKeys extends keyof GenericParams ? OO.PartialKeys<GenericParams, InferredKeys> : never;
export type ServerRouteToClientRequestParams<GenericServerRoute extends ServerRoute = ServerRoute, GenericHookParams extends Record<string, unknown> = Record<string, unknown>> = GenericServerRoute extends any ? SimplifyTopLevel<({
    method: GenericServerRoute["method"];
    path: GenericServerRoute["path"];
    abortController?: AbortController;
    initParams?: ClientRequestInitParams;
    hookParams?: GenericHookParams;
    bypassClientCache?: boolean;
    refreshClientCache?: boolean;
    clientCache?: "auto" | CreateClientCacheKey<GenericHookParams>;
} & MaybeParams<(IsEqual<GenericServerRoute["headers"], unknown> extends true ? {} : {
    headers: ServerRouteToClientRequestParamsHeaders<GenericServerRoute["headers"]>;
}) & (IsEqual<GenericServerRoute["params"], unknown> extends true ? {} : {
    params: ServerRouteToClientRequestParamsParams<GenericServerRoute["params"]>;
}) & (IsEqual<GenericServerRoute["query"], unknown> extends true ? {} : {
    query: ServerRouteToClientRequestParamsQuery<GenericServerRoute["query"]>;
}) & (IsEqual<GenericServerRoute["body"], unknown> extends true ? {} : {
    body: GenericServerRoute["body"];
})>)> extends infer InferredResult extends ClientRequestParams<GenericHookParams> ? InferredResult : never : never;
export {};
