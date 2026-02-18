import { type NeverCoalescing, type MaybePromise } from "@duplojs/utils";
import { type Hooks, type ErrorHook, type NotPredictedResponseHook } from "./hooks";
import * as EE from "@duplojs/utils/either";
import { type RequestErrorContent } from "./unexpectedResponseError";
import { type NotPredictedClientResponse, type ClientRequestParams, type ClientResponse } from "./types";
type MaybeResponse<GenericClientResponse extends ClientResponse = ClientResponse> = (EE.Right<"response", GenericClientResponse> | EE.Left<"request-error", RequestErrorContent>);
type MaybeWantedResponse<GenericWantedClientResponse extends ClientResponse = ClientResponse, GenericUnexpectClientResponse extends ClientResponse = ClientResponse> = (EE.Right<"response", GenericWantedClientResponse> | EE.Left<"unexpect-response", GenericUnexpectClientResponse> | EE.Left<"request-error", RequestErrorContent>);
export interface PromiseRequestParams<GenericHookParams extends Record<string, unknown> = Record<string, unknown>> extends ClientRequestParams<GenericHookParams> {
    baseUrl: string;
    hooks: Hooks;
    informationHeaderKey: string;
    predictedHeaderKey: string;
    disabledPredicateMode: boolean;
}
export declare class PromiseRequest<GenericPromiseRequestParams extends PromiseRequestParams = PromiseRequestParams, GenericClientResponse extends ClientResponse = ClientResponse> extends Promise<MaybeResponse<GenericClientResponse | NotPredictedClientResponse<GenericPromiseRequestParams>>> {
    params: PromiseRequestParams;
    readonly hooks: Partial<Hooks>;
    constructor(params: PromiseRequestParams);
    addRequestInterceptor(callback: (requestParams: GenericPromiseRequestParams) => MaybePromise<GenericPromiseRequestParams>): this;
    addResponseInterceptor(callback: (response: GenericClientResponse) => MaybePromise<GenericClientResponse>): this;
    whenNotPredictedResponse(callback: NotPredictedResponseHook<GenericPromiseRequestParams>): this;
    whenInformation<GenericInformation extends Extract<GenericClientResponse["information"], string>>(information: GenericInformation | GenericInformation[], callback: (response: NeverCoalescing<Extract<GenericClientResponse, GenericInformation extends any ? {
        information: GenericInformation;
    } : never>, ClientResponse<GenericPromiseRequestParams>>) => MaybePromise<void>): this;
    whenCode<GenericCode extends GenericClientResponse["code"]>(code: GenericCode | GenericCode[], callback: (response: NeverCoalescing<Extract<GenericClientResponse, GenericCode extends any ? {
        code: GenericCode;
    } : never>, ClientResponse<GenericPromiseRequestParams>>) => MaybePromise<void>): this;
    whenInformationalResponse(callback: (response: NeverCoalescing<Extract<GenericClientResponse, {
        code: `1${number}`;
    }>, ClientResponse<GenericPromiseRequestParams>>) => MaybePromise<void>): this;
    whenSuccessfulResponse(callback: (response: NeverCoalescing<Extract<GenericClientResponse, {
        code: `2${number}`;
    }>, ClientResponse<GenericPromiseRequestParams>>) => MaybePromise<void>): this;
    whenRedirectionResponse(callback: (response: NeverCoalescing<Extract<GenericClientResponse, {
        code: `3${number}`;
    }>, ClientResponse<GenericPromiseRequestParams>>) => MaybePromise<void>): this;
    whenClientErrorResponse(callback: (response: NeverCoalescing<Extract<GenericClientResponse, {
        code: `4${number}`;
    }>, ClientResponse<GenericPromiseRequestParams>>) => MaybePromise<void>): this;
    whenServerErrorResponse(callback: (response: NeverCoalescing<Extract<GenericClientResponse, {
        code: `5${number}`;
    }>, ClientResponse<GenericPromiseRequestParams>>) => MaybePromise<void>): this;
    whenExpectedResponse(callback: (response: NeverCoalescing<Extract<GenericClientResponse, {
        code: `2${number}` | `4${number}`;
    }>, ClientResponse<GenericPromiseRequestParams>>) => MaybePromise<void>): this;
    whenError(callback: ErrorHook<GenericPromiseRequestParams>): this;
    iWantInformation<GenericInformation extends Extract<GenericClientResponse["information"], string>, GenericResponse extends NeverCoalescing<Extract<GenericClientResponse, GenericInformation extends any ? {
        information: GenericInformation;
    } : never>, ClientResponse<GenericPromiseRequestParams>>>(information: GenericInformation | GenericInformation[]): Promise<MaybeWantedResponse<GenericResponse, NeverCoalescing<Exclude<GenericClientResponse, GenericResponse>, ClientResponse<GenericPromiseRequestParams>>>>;
    iWantCode<GenericCode extends GenericClientResponse["code"], GenericResponse extends NeverCoalescing<Extract<GenericClientResponse, GenericCode extends any ? {
        code: GenericCode;
    } : never>, ClientResponse<GenericPromiseRequestParams>>>(code: GenericCode | GenericCode[]): Promise<MaybeWantedResponse<GenericResponse, NeverCoalescing<Exclude<GenericClientResponse, GenericResponse>, ClientResponse<GenericPromiseRequestParams>>>>;
    iWantInformationalResponse<GenericResponse extends NeverCoalescing<Extract<GenericClientResponse, {
        code: `1${number}`;
    }>, ClientResponse<GenericPromiseRequestParams>>>(): Promise<MaybeWantedResponse<GenericResponse, NeverCoalescing<Exclude<GenericClientResponse, GenericResponse>, ClientResponse<GenericPromiseRequestParams>>>>;
    iWantSuccessfulResponse<GenericResponse extends NeverCoalescing<Extract<GenericClientResponse, {
        code: `2${number}`;
    }>, ClientResponse<GenericPromiseRequestParams>>>(): Promise<MaybeWantedResponse<GenericResponse, NeverCoalescing<Exclude<GenericClientResponse, GenericResponse>, ClientResponse<GenericPromiseRequestParams>>>>;
    iWantRedirectionResponse<GenericResponse extends NeverCoalescing<Extract<GenericClientResponse, {
        code: `3${number}`;
    }>, ClientResponse<GenericPromiseRequestParams>>>(): Promise<MaybeWantedResponse<GenericResponse, NeverCoalescing<Exclude<GenericClientResponse, GenericResponse>, ClientResponse<GenericPromiseRequestParams>>>>;
    iWantClientErrorResponse<GenericResponse extends NeverCoalescing<Extract<GenericClientResponse, {
        code: `4${number}`;
    }>, ClientResponse<GenericPromiseRequestParams>>>(): Promise<MaybeWantedResponse<GenericResponse, NeverCoalescing<Exclude<GenericClientResponse, GenericResponse>, ClientResponse<GenericPromiseRequestParams>>>>;
    iWantServerErrorResponse<GenericResponse extends NeverCoalescing<Extract<GenericClientResponse, {
        code: `5${number}`;
    }>, ClientResponse<GenericPromiseRequestParams>>>(): Promise<MaybeWantedResponse<GenericResponse, NeverCoalescing<Exclude<GenericClientResponse, GenericResponse>, ClientResponse<GenericPromiseRequestParams>>>>;
    iWantExpectedResponse<GenericResponse extends NeverCoalescing<Extract<GenericClientResponse, {
        code: `2${number}` | `4${number}`;
    }>, ClientResponse<GenericPromiseRequestParams>>>(): Promise<MaybeWantedResponse<GenericResponse, NeverCoalescing<Exclude<GenericClientResponse, GenericResponse>, ClientResponse<GenericPromiseRequestParams>>>>;
    iWantInformationOrThrow<GenericInformation extends Extract<GenericClientResponse["information"], string>>(information: GenericInformation | GenericInformation[]): Promise<NeverCoalescing<Extract<GenericClientResponse, GenericInformation extends any ? {
        information: GenericInformation;
    } : never>, ClientResponse<GenericPromiseRequestParams>>>;
    iWantCodeOrThrow<GenericCode extends GenericClientResponse["code"]>(code: GenericCode | GenericCode[]): Promise<NeverCoalescing<Extract<GenericClientResponse, GenericCode extends any ? {
        code: GenericCode;
    } : never>, ClientResponse<GenericPromiseRequestParams>>>;
    iWantInformationalResponseOrThrow(): Promise<NeverCoalescing<Extract<GenericClientResponse, {
        code: `1${number}`;
    }>, ClientResponse<GenericPromiseRequestParams>>>;
    iWantSuccessfulResponseOrThrow(): Promise<NeverCoalescing<Extract<GenericClientResponse, {
        code: `2${number}`;
    }>, ClientResponse<GenericPromiseRequestParams>>>;
    iWantRedirectionResponseOrThrow(): Promise<NeverCoalescing<Extract<GenericClientResponse, {
        code: `3${number}`;
    }>, ClientResponse<GenericPromiseRequestParams>>>;
    iWantClientErrorResponseOrThrow(): Promise<NeverCoalescing<Extract<GenericClientResponse, {
        code: `4${number}`;
    }>, ClientResponse<GenericPromiseRequestParams>>>;
    iWantServerErrorResponseOrThrow(): Promise<NeverCoalescing<Extract<GenericClientResponse, {
        code: `5${number}`;
    }>, ClientResponse<GenericPromiseRequestParams>>>;
    iWantExpectedResponseOrThrow(): Promise<NeverCoalescing<Extract<GenericClientResponse, {
        code: `2${number}` | `4${number}`;
    }>, ClientResponse<GenericPromiseRequestParams>>>;
    static get [Symbol.species](): PromiseConstructor;
    static fetch<GenericPromiseRequestParams extends PromiseRequestParams>(requestParams: GenericPromiseRequestParams): Promise<MaybeResponse>;
}
export {};
