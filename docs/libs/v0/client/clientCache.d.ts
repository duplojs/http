import { type PromiseRequestParams, type ClientResponse, type CreateClientCacheKeyParams } from "./types";
export declare function autoCreateCacheKey(params: CreateClientCacheKeyParams): string | null;
export declare function findResponseFromCacheStore(requestParams: PromiseRequestParams): null | ClientResponse;
export declare function saveResponseInCacheStore(requestParams: PromiseRequestParams, clientResponse: ClientResponse): void;
