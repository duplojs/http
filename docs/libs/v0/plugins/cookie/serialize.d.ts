import { D } from "@duplojs/utils";
declare const SerializeCookieError_base: new (params: {
    "@DuplojsCookiePlugin/serialize-cookie-error"?: unknown;
}, parentParams: readonly [message?: string | undefined, options?: ErrorOptions | undefined]) => import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"@DuplojsCookiePlugin/serialize-cookie-error", unknown>, unknown> & import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"serialize-cookie-error", unknown>, unknown> & Error;
export declare class SerializeCookieError extends SerializeCookieError_base {
    constructor(message: string);
}
interface SerializerParamsBase {
    maxAge?: number;
    domain?: string;
    path?: string;
    httpOnly?: boolean;
    secure?: boolean;
    partitioned?: boolean;
    priority?: "low" | "medium" | "high";
    sameSite?: "lax" | "strict" | "none";
}
export interface SerializerParamsWithExpires extends SerializerParamsBase {
    expires?: D.TheDate;
    expireIn?: undefined;
}
export interface SerializerParamsWithExpireIn extends SerializerParamsBase {
    expires?: undefined;
    expireIn?: D.TheTime;
}
export type SerializerParams = SerializerParamsWithExpires | SerializerParamsWithExpireIn;
export declare function defaultSerializer(name: string, value: string, params?: SerializerParams): string;
export type Serializer = typeof defaultSerializer;
export {};
