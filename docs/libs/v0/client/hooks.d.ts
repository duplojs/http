import { type CodeHook, type ErrorHook, type InformationHook, type NotPredictedResponseHook, type RequestHook, type ResponseHook, type ResponseTypeHook, type PromiseRequestParams, type NotPredictedClientResponse, type ClientResponse } from "./types";
export declare function launchRequestHook(clientHook: readonly RequestHook[], promiseRequestHook: readonly RequestHook[], requestParams: PromiseRequestParams): Promise<PromiseRequestParams>;
export declare function launchResponseHook(clientHook: readonly ResponseHook[], promiseRequestHook: readonly ResponseHook[], response: ClientResponse): Promise<ClientResponse>;
export declare function launchInformationHook(clientHook: readonly InformationHook[], promiseRequestHook: readonly InformationHook[], response: ClientResponse): Promise<void>;
export declare function launchCodeHook(clientHook: readonly CodeHook[], promiseRequestHook: readonly CodeHook[], response: ClientResponse): Promise<void>;
export declare function launchResponseTypeHook(clientHook: readonly ResponseTypeHook[], promiseRequestHook: readonly ResponseTypeHook[], response: ClientResponse): Promise<void>;
export declare function launchExpectedResponseHook(clientHook: readonly ResponseTypeHook[], promiseRequestHook: readonly ResponseTypeHook[], response: ClientResponse): Promise<void>;
export declare function launchNotPredictedHook(clientHook: readonly NotPredictedResponseHook[], promiseRequestHook: readonly NotPredictedResponseHook[], response: NotPredictedClientResponse): Promise<void>;
export declare function launchErrorHook(clientHook: readonly ErrorHook[], promiseRequestHook: readonly ErrorHook[], error: unknown, requestParams: PromiseRequestParams): Promise<void>;
