import { type NeverCoalescing, type MaybePromise, type O } from "@duplojs/utils";
import * as EE from "@duplojs/utils/either";
import { type RequestErrorContent } from "./unexpectedResponseError";
import { type PromiseRequestParams, type Hooks, type NotPredictedResponseHook, type ErrorHook, type ClientEventsResponse, type AllClientResponse, type AllNotPredictedClientResponse, type ClientEventsResponseHandler, type ServerEvent, type ClientStreamResponseHandler, type ClientStreamResponse } from "./types";
type MaybeResponse<GenericClientResponse extends AllClientResponse = AllClientResponse> = (EE.Right<"response", GenericClientResponse> | EE.Left<"request-error", RequestErrorContent>);
type MaybeWantedResponse<GenericWantedClientResponse extends AllClientResponse = AllClientResponse, GenericUnexpectClientResponse extends AllClientResponse = AllClientResponse> = (EE.Right<"response", GenericWantedClientResponse> | EE.Left<"unexpect-response", GenericUnexpectClientResponse> | EE.Left<"request-error", RequestErrorContent>);
export declare class PromiseRequest<GenericHookParams extends Record<string, unknown> = Record<string, unknown>, GenericClientResponse extends AllClientResponse<GenericHookParams> = AllClientResponse<GenericHookParams>> extends Promise<MaybeResponse<GenericClientResponse | AllNotPredictedClientResponse<GenericHookParams>>> {
    params: PromiseRequestParams;
    readonly hooks: Partial<Hooks>;
    constructor(params: PromiseRequestParams);
    addRequestInterceptor(callback: (requestParams: GenericClientResponse["requestParams"]) => MaybePromise<GenericClientResponse["requestParams"]>): this;
    addResponseInterceptor(callback: (response: GenericClientResponse) => MaybePromise<GenericClientResponse>): this;
    whenNotPredictedResponse(callback: NotPredictedResponseHook<GenericHookParams>): this;
    whenInformation<GenericInformation extends Extract<GenericClientResponse["information"], string>>(information: GenericInformation | GenericInformation[], callback: (response: NeverCoalescing<Extract<GenericClientResponse, GenericInformation extends any ? {
        information: GenericInformation;
    } : never>, AllClientResponse<GenericHookParams>>) => MaybePromise<void>): this;
    whenCode<GenericCode extends GenericClientResponse["code"]>(code: GenericCode | GenericCode[], callback: (response: NeverCoalescing<Extract<GenericClientResponse, GenericCode extends any ? {
        code: GenericCode;
    } : never>, AllClientResponse<GenericHookParams>>) => MaybePromise<void>): this;
    whenInformationalResponse(callback: (response: NeverCoalescing<Extract<GenericClientResponse, {
        code: `1${number}`;
    }>, AllClientResponse<GenericHookParams>>) => MaybePromise<void>): this;
    whenSuccessfulResponse(callback: (response: NeverCoalescing<Extract<GenericClientResponse, {
        code: `2${number}`;
    }>, AllClientResponse<GenericHookParams>>) => MaybePromise<void>): this;
    whenRedirectionResponse(callback: (response: NeverCoalescing<Extract<GenericClientResponse, {
        code: `3${number}`;
    }>, AllClientResponse<GenericHookParams>>) => MaybePromise<void>): this;
    whenClientErrorResponse(callback: (response: NeverCoalescing<Extract<GenericClientResponse, {
        code: `4${number}`;
    }>, AllClientResponse<GenericHookParams>>) => MaybePromise<void>): this;
    whenServerErrorResponse(callback: (response: NeverCoalescing<Extract<GenericClientResponse, {
        code: `5${number}`;
    }>, AllClientResponse<GenericHookParams>>) => MaybePromise<void>): this;
    whenExpectedResponse(callback: (response: NeverCoalescing<Extract<GenericClientResponse, {
        code: `2${number}` | `4${number}`;
    }>, AllClientResponse<GenericHookParams>>) => MaybePromise<void>): this;
    whenError(callback: ErrorHook<GenericHookParams>): this;
    whenReceiveServerEvent<GenericEvent extends (GenericClientResponse extends ClientEventsResponseHandler<infer InferredEvent> ? InferredEvent : never), GenericEventName extends GenericEvent["event"]>(eventName: GenericEventName, callback: (event: NoInfer<NeverCoalescing<Extract<GenericEvent, {
        event: GenericEventName;
    }>, ServerEvent>>, response: NeverCoalescing<Extract<GenericClientResponse, ClientEventsResponseHandler<GenericEvent>>, ClientEventsResponse>) => MaybePromise<void>): this;
    whenReceiveDataStream<GenericFlux extends (GenericClientResponse extends ClientStreamResponseHandler<infer InferredFlux> ? InferredFlux : never)>(callback: (data: GenericFlux, response: NeverCoalescing<Extract<GenericClientResponse, ClientStreamResponseHandler>, ClientStreamResponse>) => MaybePromise<void>): this;
    iWantInformation<GenericInformation extends Extract<GenericClientResponse["information"], string>, GenericResponse extends NeverCoalescing<Extract<GenericClientResponse, GenericInformation extends any ? {
        information: GenericInformation;
    } : never>, AllClientResponse<GenericHookParams>>>(information: GenericInformation | GenericInformation[]): Promise<MaybeWantedResponse<GenericResponse, NeverCoalescing<Exclude<GenericClientResponse, GenericResponse>, AllClientResponse<GenericHookParams>> | AllNotPredictedClientResponse<GenericHookParams>>>;
    iWantCode<GenericCode extends GenericClientResponse["code"], GenericResponse extends NeverCoalescing<Extract<GenericClientResponse, GenericCode extends any ? {
        code: GenericCode;
    } : never>, AllClientResponse<GenericHookParams>>>(code: GenericCode | GenericCode[]): Promise<MaybeWantedResponse<GenericResponse, NeverCoalescing<Exclude<GenericClientResponse, GenericResponse>, AllClientResponse<GenericHookParams>> | AllNotPredictedClientResponse<GenericHookParams>>>;
    iWantInformationalResponse<GenericResponse extends NeverCoalescing<Extract<GenericClientResponse, {
        code: `1${number}`;
    }>, AllClientResponse<GenericHookParams>>>(): Promise<MaybeWantedResponse<GenericResponse, NeverCoalescing<Exclude<GenericClientResponse, GenericResponse>, AllClientResponse<GenericHookParams>> | AllNotPredictedClientResponse<GenericHookParams>>>;
    iWantSuccessfulResponse<GenericResponse extends NeverCoalescing<Extract<GenericClientResponse, {
        code: `2${number}`;
    }>, AllClientResponse<GenericHookParams>>>(): Promise<MaybeWantedResponse<GenericResponse, NeverCoalescing<Exclude<GenericClientResponse, GenericResponse>, AllClientResponse<GenericHookParams>> | AllNotPredictedClientResponse<GenericHookParams>>>;
    iWantRedirectionResponse<GenericResponse extends NeverCoalescing<Extract<GenericClientResponse, {
        code: `3${number}`;
    }>, AllClientResponse<GenericHookParams>>>(): Promise<MaybeWantedResponse<GenericResponse, NeverCoalescing<Exclude<GenericClientResponse, GenericResponse>, AllClientResponse<GenericHookParams>> | AllNotPredictedClientResponse<GenericHookParams>>>;
    iWantClientErrorResponse<GenericResponse extends NeverCoalescing<Extract<GenericClientResponse, {
        code: `4${number}`;
    }>, AllClientResponse<GenericHookParams>>>(): Promise<MaybeWantedResponse<GenericResponse, NeverCoalescing<Exclude<GenericClientResponse, GenericResponse>, AllClientResponse<GenericHookParams>> | AllNotPredictedClientResponse<GenericHookParams>>>;
    iWantServerErrorResponse<GenericResponse extends NeverCoalescing<Extract<GenericClientResponse, {
        code: `5${number}`;
    }>, AllClientResponse<GenericHookParams>>>(): Promise<MaybeWantedResponse<GenericResponse, NeverCoalescing<Exclude<GenericClientResponse, GenericResponse>, AllClientResponse<GenericHookParams>> | AllNotPredictedClientResponse<GenericHookParams>>>;
    iWantExpectedResponse<GenericResponse extends NeverCoalescing<Extract<GenericClientResponse, {
        code: `2${number}` | `4${number}`;
    }>, AllClientResponse<GenericHookParams>>>(): Promise<MaybeWantedResponse<GenericResponse, NeverCoalescing<Exclude<GenericClientResponse, GenericResponse>, AllClientResponse<GenericHookParams>> | AllNotPredictedClientResponse<GenericHookParams>>>;
    iSelectExpectedResponseByInformation<const GenericSelector extends Record<Extract<GenericClientResponse["information"], string>, boolean>, GenericResponse extends Extract<GenericClientResponse, {
        information: O.GetPropsWithValue<GenericSelector, true>;
    } | {
        information: O.GetPropsWithValue<GenericSelector, boolean>;
    }>, GenericUnexpectedResponse extends Extract<GenericClientResponse, {
        information: O.GetPropsWithValue<GenericSelector, false>;
    } | {
        information: O.GetPropsWithValue<GenericSelector, boolean>;
    }>>(selector: GenericSelector): Promise<MaybeWantedResponse<NeverCoalescing<GenericResponse, AllClientResponse<GenericHookParams>>, NeverCoalescing<GenericUnexpectedResponse, AllClientResponse<GenericHookParams>> | AllNotPredictedClientResponse<GenericHookParams>>>;
    iWantInformationOrThrow<GenericInformation extends Extract<GenericClientResponse["information"], string>>(information: GenericInformation | GenericInformation[]): Promise<NeverCoalescing<Extract<GenericClientResponse, GenericInformation extends any ? {
        information: GenericInformation;
    } : never>, AllClientResponse<GenericHookParams>>>;
    iWantCodeOrThrow<GenericCode extends GenericClientResponse["code"]>(code: GenericCode | GenericCode[]): Promise<NeverCoalescing<Extract<GenericClientResponse, GenericCode extends any ? {
        code: GenericCode;
    } : never>, AllClientResponse<GenericHookParams>>>;
    iWantInformationalResponseOrThrow(): Promise<NeverCoalescing<Extract<GenericClientResponse, {
        code: `1${number}`;
    }>, AllClientResponse<GenericHookParams>>>;
    iWantSuccessfulResponseOrThrow(): Promise<NeverCoalescing<Extract<GenericClientResponse, {
        code: `2${number}`;
    }>, AllClientResponse<GenericHookParams>>>;
    iWantRedirectionResponseOrThrow(): Promise<NeverCoalescing<Extract<GenericClientResponse, {
        code: `3${number}`;
    }>, AllClientResponse<GenericHookParams>>>;
    iWantClientErrorResponseOrThrow(): Promise<NeverCoalescing<Extract<GenericClientResponse, {
        code: `4${number}`;
    }>, AllClientResponse<GenericHookParams>>>;
    iWantServerErrorResponseOrThrow(): Promise<NeverCoalescing<Extract<GenericClientResponse, {
        code: `5${number}`;
    }>, AllClientResponse<GenericHookParams>>>;
    iWantExpectedResponseOrThrow(): Promise<NeverCoalescing<Extract<GenericClientResponse, {
        code: `2${number}` | `4${number}`;
    }>, AllClientResponse<GenericHookParams>>>;
    iSelectExpectedResponseByInformationOrThrow<const GenericSelector extends Record<Extract<GenericClientResponse["information"], string>, boolean>, GenericResponse extends Extract<GenericClientResponse, {
        information: O.GetPropsWithValue<GenericSelector, true>;
    } | {
        information: O.GetPropsWithValue<GenericSelector, boolean>;
    }>>(selector: GenericSelector): Promise<NeverCoalescing<GenericResponse, AllClientResponse<GenericHookParams>>>;
    static get [Symbol.species](): PromiseConstructor;
    static fetch<GenericPromiseRequestParams extends PromiseRequestParams>(requestParams: GenericPromiseRequestParams): Promise<MaybeResponse>;
}
export {};
