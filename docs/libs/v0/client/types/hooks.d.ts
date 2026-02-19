import { type MaybePromise } from "@duplojs/utils";
import { type NotPredictedClientResponse, type ClientResponse } from "./clientResponse";
import { type PromiseRequestParams } from "./promiseRequestParams";
export type RequestHook<GenericHookParams extends Record<string, unknown> = Record<string, unknown>> = (requestParams: PromiseRequestParams<GenericHookParams>) => MaybePromise<PromiseRequestParams<GenericHookParams>>;
export type ResponseHook<GenericHookParams extends Record<string, unknown> = Record<string, unknown>> = (response: ClientResponse<GenericHookParams>) => MaybePromise<ClientResponse<GenericHookParams>>;
export type InformationHook<GenericHookParams extends Record<string, unknown> = Record<string, unknown>> = (response: ClientResponse<GenericHookParams>) => MaybePromise<void>;
export type ResponseTypeHook<GenericHookParams extends Record<string, unknown> = Record<string, unknown>> = (response: ClientResponse<GenericHookParams>) => MaybePromise<void>;
export type ExpectedResponseHook<GenericHookParams extends Record<string, unknown> = Record<string, unknown>> = (response: ClientResponse<GenericHookParams>) => MaybePromise<void>;
export type CodeHook<GenericHookParams extends Record<string, unknown> = Record<string, unknown>> = (response: ClientResponse<GenericHookParams>) => MaybePromise<void>;
export type NotPredictedResponseHook<GenericHookParams extends Record<string, unknown> = Record<string, unknown>> = (response: NotPredictedClientResponse<GenericHookParams>) => MaybePromise<void>;
export type ErrorHook<GenericHookParams extends Record<string, unknown> = Record<string, unknown>> = (error: unknown, requestParams: PromiseRequestParams<GenericHookParams>) => MaybePromise<void>;
export interface Hooks {
    request: RequestHook[];
    response: ResponseHook[];
    information: Record<string, InformationHook[]>;
    code: Record<string, CodeHook[]>;
    informationalResponseType: ResponseTypeHook[];
    successfulResponseType: ResponseTypeHook[];
    redirectionResponseType: ResponseTypeHook[];
    clientErrorResponseType: ResponseTypeHook[];
    serverErrorResponseType: ResponseTypeHook[];
    expectedResponse: ExpectedResponseHook[];
    notPredictedResponse: NotPredictedResponseHook[];
    error: ErrorHook[];
}
