import { type S } from "@duplojs/utils";
export type InformationResponseCode = `1${S.Digit}${S.Digit}`;
export type SuccessResponseCode = `2${S.Digit}${S.Digit}`;
export type RedirectionResponseCode = `3${S.Digit}${S.Digit}`;
export type ClientErrorResponseCode = `4${S.Digit}${S.Digit}`;
export type ServerErrorResponseCode = `5${S.Digit}${S.Digit}`;
export type ResponseCode = (InformationResponseCode | SuccessResponseCode | RedirectionResponseCode | ClientErrorResponseCode | ServerErrorResponseCode);
declare const Response_base: new (params?: {
    "@DuplojsHttpCore/response"?: unknown;
} | undefined) => import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/response", unknown>, unknown> & import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"response", unknown>, unknown>;
export declare class Response<GenericCode extends ResponseCode = ResponseCode, GenericInformation extends string = string, GenericBody extends unknown = unknown> extends Response_base {
    code: GenericCode;
    information: GenericInformation;
    body: GenericBody;
    headers: Record<string, string | string[]> | undefined;
    constructor(code: GenericCode, information: GenericInformation, body: GenericBody);
    setHeaders(headers: Partial<Record<string, string | string[]>>): this;
    setHeader(key: string, header?: string | string[]): this;
    deleteHeader(key: string): this;
}
export {};
