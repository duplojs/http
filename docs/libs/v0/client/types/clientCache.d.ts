import type * as SS from "@duplojs/utils/string";
import { type ClientRequestParamsBody, type ClientRequestParamsHeaders, type ClientRequestParamsParams, type ClientRequestParamsQuery } from "./clientRequestParams";
import { type ClientResponseBody } from "./clientResponse";
import { type BivariantFunction } from "@duplojs/utils";
export interface ClientCacheValue {
    information?: string;
    body: ClientResponseBody;
    headers: Record<string, string>;
    ok: boolean | null;
    type: ResponseType;
    code: SS.Number;
    url: string;
    redirected: boolean;
    predicted: boolean;
}
export type ClientCacheInitialValues = Record<string, ClientCacheValue>;
export type ClientCacheStore = Map<string, ClientCacheValue>;
export interface CreateClientCacheKeyParams<GenericHookParams extends Record<string, unknown> = Record<string, unknown>> {
    method: string;
    path: string;
    headers: ClientRequestParamsHeaders | undefined;
    params: ClientRequestParamsParams | undefined;
    query: ClientRequestParamsQuery | undefined;
    body: ClientRequestParamsBody;
    hookParams: GenericHookParams | undefined;
}
export type CreateClientCacheKey<GenericHookParams extends Record<string, unknown> = Record<string, unknown>> = BivariantFunction<(params: CreateClientCacheKeyParams<GenericHookParams>) => string | null>;
