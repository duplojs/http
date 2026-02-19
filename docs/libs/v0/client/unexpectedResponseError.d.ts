import { type PromiseRequestParams, type ClientResponse } from "./types";
export interface RequestErrorContent {
    error: unknown;
    requestParams: PromiseRequestParams;
}
declare const UnexpectedInformationResponseError_base: new (params: {
    "@DuplojsHttpClient/unexpected-information-response-error"?: unknown;
}, parentParams: readonly [message?: string | undefined, options?: ErrorOptions | undefined]) => import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"@DuplojsHttpClient/unexpected-information-response-error", unknown>, unknown> & import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"unexpected-information-response-error", unknown>, unknown> & Error;
export declare class UnexpectedInformationResponseError extends UnexpectedInformationResponseError_base {
    information: string | string[];
    response: RequestErrorContent | ClientResponse;
    constructor(information: string | string[], response: RequestErrorContent | ClientResponse);
}
declare const UnexpectedCodeResponseError_base: new (params: {
    "@DuplojsHttpClient/unexpected-code-response-error"?: unknown;
}, parentParams: readonly [message?: string | undefined, options?: ErrorOptions | undefined]) => Error & import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"@DuplojsHttpClient/unexpected-code-response-error", unknown>, unknown> & import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"unexpected-code-response-error", unknown>, unknown>;
export declare class UnexpectedCodeResponseError extends UnexpectedCodeResponseError_base {
    code: string | string[];
    response: RequestErrorContent | ClientResponse;
    constructor(code: string | string[], response: RequestErrorContent | ClientResponse);
}
declare const UnexpectedResponseTypeError_base: new (params: {
    "@DuplojsHttpClient/unexpected-response-type-error"?: unknown;
}, parentParams: readonly [message?: string | undefined, options?: ErrorOptions | undefined]) => Error & import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"@DuplojsHttpClient/unexpected-response-type-error", unknown>, unknown> & import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"unexpected-response-type-error", unknown>, unknown>;
export declare class UnexpectedResponseTypeError extends UnexpectedResponseTypeError_base {
    expectType: "informational" | "successful" | "redirection" | "clientError" | "serverError";
    response: RequestErrorContent | ClientResponse;
    constructor(expectType: "informational" | "successful" | "redirection" | "clientError" | "serverError", response: RequestErrorContent | ClientResponse);
}
declare const UnexpectedResponseError_base: new (params: {
    "@DuplojsHttpClient/unexpected-response-error"?: unknown;
}, parentParams: readonly [message?: string | undefined, options?: ErrorOptions | undefined]) => Error & import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"@DuplojsHttpClient/unexpected-response-error", unknown>, unknown> & import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"unexpected-response-error", unknown>, unknown>;
export declare class UnexpectedResponseError extends UnexpectedResponseError_base {
    response: RequestErrorContent | ClientResponse;
    constructor(response: RequestErrorContent | ClientResponse);
}
export {};
