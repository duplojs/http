import { type NeverCoalescing, type MaybePromise } from "@duplojs/utils";
import * as EE from "@duplojs/utils/either";
import { type RequestErrorContent } from "./unexpectedResponseError";
import { type NotPredictedClientResponse, type ClientResponse, type PromiseRequestParams, type Hooks, type NotPredictedResponseHook, type ErrorHook } from "./types";
type MaybeResponse<GenericClientResponse extends ClientResponse = ClientResponse> = (EE.Right<"response", GenericClientResponse> | EE.Left<"request-error", RequestErrorContent>);
type MaybeWantedResponse<GenericWantedClientResponse extends ClientResponse = ClientResponse, GenericUnexpectClientResponse extends ClientResponse = ClientResponse> = (EE.Right<"response", GenericWantedClientResponse> | EE.Left<"unexpect-response", GenericUnexpectClientResponse> | EE.Left<"request-error", RequestErrorContent>);
export declare class PromiseRequest<GenericHookParams extends Record<string, unknown> = Record<string, unknown>, GenericClientResponse extends ClientResponse<GenericHookParams> = ClientResponse<GenericHookParams>> extends Promise<MaybeResponse<GenericClientResponse | NotPredictedClientResponse<GenericHookParams>>> {
    params: PromiseRequestParams;
    readonly hooks: Partial<Hooks>;
    constructor(params: PromiseRequestParams);
    addRequestInterceptor(callback: (requestParams: GenericClientResponse["requestParams"]) => MaybePromise<GenericClientResponse["requestParams"]>): this;
    addResponseInterceptor(callback: (response: GenericClientResponse) => MaybePromise<GenericClientResponse>): this;
    whenNotPredictedResponse(callback: NotPredictedResponseHook<GenericHookParams>): this;
    whenInformation<GenericInformation extends Extract<GenericClientResponse["information"], string>>(information: GenericInformation | GenericInformation[], callback: (response: NeverCoalescing<Extract<GenericClientResponse, GenericInformation extends any ? {
        information: GenericInformation;
    } : never>, ClientResponse<GenericHookParams>>) => MaybePromise<void>): this;
    whenCode<GenericCode extends GenericClientResponse["code"]>(code: GenericCode | GenericCode[], callback: (response: NeverCoalescing<Extract<GenericClientResponse, GenericCode extends any ? {
        code: GenericCode;
    } : never>, ClientResponse<GenericHookParams>>) => MaybePromise<void>): this;
    whenInformationalResponse(callback: (response: NeverCoalescing<Extract<GenericClientResponse, {
        code: `1${number}`;
    }>, ClientResponse<GenericHookParams>>) => MaybePromise<void>): this;
    whenSuccessfulResponse(callback: (response: NeverCoalescing<Extract<GenericClientResponse, {
        code: `2${number}`;
    }>, ClientResponse<GenericHookParams>>) => MaybePromise<void>): this;
    whenRedirectionResponse(callback: (response: NeverCoalescing<Extract<GenericClientResponse, {
        code: `3${number}`;
    }>, ClientResponse<GenericHookParams>>) => MaybePromise<void>): this;
    whenClientErrorResponse(callback: (response: NeverCoalescing<Extract<GenericClientResponse, {
        code: `4${number}`;
    }>, ClientResponse<GenericHookParams>>) => MaybePromise<void>): this;
    whenServerErrorResponse(callback: (response: NeverCoalescing<Extract<GenericClientResponse, {
        code: `5${number}`;
    }>, ClientResponse<GenericHookParams>>) => MaybePromise<void>): this;
    whenExpectedResponse(callback: (response: NeverCoalescing<Extract<GenericClientResponse, {
        code: `2${number}` | `4${number}`;
    }>, ClientResponse<GenericHookParams>>) => MaybePromise<void>): this;
    whenError(callback: ErrorHook<GenericHookParams>): this;
    iWantInformation<GenericInformation extends Extract<GenericClientResponse["information"], string>, GenericResponse extends NeverCoalescing<Extract<GenericClientResponse, GenericInformation extends any ? {
        information: GenericInformation;
    } : never>, ClientResponse<GenericHookParams>>>(information: GenericInformation | GenericInformation[]): Promise<MaybeWantedResponse<GenericResponse, NeverCoalescing<Exclude<GenericClientResponse, GenericResponse>, ClientResponse<GenericHookParams>>>>;
    iWantCode<GenericCode extends GenericClientResponse["code"], GenericResponse extends NeverCoalescing<Extract<GenericClientResponse, GenericCode extends any ? {
        code: GenericCode;
    } : never>, ClientResponse<GenericHookParams>>>(code: GenericCode | GenericCode[]): Promise<MaybeWantedResponse<GenericResponse, NeverCoalescing<Exclude<GenericClientResponse, GenericResponse>, ClientResponse<GenericHookParams>>>>;
    iWantInformationalResponse<GenericResponse extends NeverCoalescing<Extract<GenericClientResponse, {
        code: `1${number}`;
    }>, ClientResponse<GenericHookParams>>>(): Promise<MaybeWantedResponse<GenericResponse, NeverCoalescing<Exclude<GenericClientResponse, GenericResponse>, ClientResponse<GenericHookParams>>>>;
    iWantSuccessfulResponse<GenericResponse extends NeverCoalescing<Extract<GenericClientResponse, {
        code: `2${number}`;
    }>, ClientResponse<GenericHookParams>>>(): Promise<MaybeWantedResponse<GenericResponse, NeverCoalescing<Exclude<GenericClientResponse, GenericResponse>, ClientResponse<GenericHookParams>>>>;
    iWantRedirectionResponse<GenericResponse extends NeverCoalescing<Extract<GenericClientResponse, {
        code: `3${number}`;
    }>, ClientResponse<GenericHookParams>>>(): Promise<MaybeWantedResponse<GenericResponse, NeverCoalescing<Exclude<GenericClientResponse, GenericResponse>, ClientResponse<GenericHookParams>>>>;
    iWantClientErrorResponse<GenericResponse extends NeverCoalescing<Extract<GenericClientResponse, {
        code: `4${number}`;
    }>, ClientResponse<GenericHookParams>>>(): Promise<MaybeWantedResponse<GenericResponse, NeverCoalescing<Exclude<GenericClientResponse, GenericResponse>, ClientResponse<GenericHookParams>>>>;
    iWantServerErrorResponse<GenericResponse extends NeverCoalescing<Extract<GenericClientResponse, {
        code: `5${number}`;
    }>, ClientResponse<GenericHookParams>>>(): Promise<MaybeWantedResponse<GenericResponse, NeverCoalescing<Exclude<GenericClientResponse, GenericResponse>, ClientResponse<GenericHookParams>>>>;
    iWantExpectedResponse<GenericResponse extends NeverCoalescing<Extract<GenericClientResponse, {
        code: `2${number}` | `4${number}`;
    }>, ClientResponse<GenericHookParams>>>(): Promise<MaybeWantedResponse<GenericResponse, NeverCoalescing<Exclude<GenericClientResponse, GenericResponse>, ClientResponse<GenericHookParams>>>>;
    iWantInformationOrThrow<GenericInformation extends Extract<GenericClientResponse["information"], string>>(information: GenericInformation | GenericInformation[]): Promise<NeverCoalescing<Extract<GenericClientResponse, GenericInformation extends any ? {
        information: GenericInformation;
    } : never>, ClientResponse<GenericHookParams>>>;
    iWantCodeOrThrow<GenericCode extends GenericClientResponse["code"]>(code: GenericCode | GenericCode[]): Promise<NeverCoalescing<Extract<GenericClientResponse, GenericCode extends any ? {
        code: GenericCode;
    } : never>, ClientResponse<GenericHookParams>>>;
    iWantInformationalResponseOrThrow(): Promise<NeverCoalescing<Extract<GenericClientResponse, {
        code: `1${number}`;
    }>, ClientResponse<GenericHookParams>>>;
    iWantSuccessfulResponseOrThrow(): Promise<NeverCoalescing<Extract<GenericClientResponse, {
        code: `2${number}`;
    }>, ClientResponse<GenericHookParams>>>;
    iWantRedirectionResponseOrThrow(): Promise<NeverCoalescing<Extract<GenericClientResponse, {
        code: `3${number}`;
    }>, ClientResponse<GenericHookParams>>>;
    iWantClientErrorResponseOrThrow(): Promise<NeverCoalescing<Extract<GenericClientResponse, {
        code: `4${number}`;
    }>, ClientResponse<GenericHookParams>>>;
    iWantServerErrorResponseOrThrow(): Promise<NeverCoalescing<Extract<GenericClientResponse, {
        code: `5${number}`;
    }>, ClientResponse<GenericHookParams>>>;
    iWantExpectedResponseOrThrow(): Promise<NeverCoalescing<Extract<GenericClientResponse, {
        code: `2${number}` | `4${number}`;
    }>, ClientResponse<GenericHookParams>>>;
    static get [Symbol.species](): PromiseConstructor;
    static fetch<GenericPromiseRequestParams extends PromiseRequestParams>(requestParams: GenericPromiseRequestParams): Promise<MaybeResponse>;
}
export {};
