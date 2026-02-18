import { type E, type MaybePromise } from "@duplojs/utils";
import { type GetPropsWithValue } from "@duplojs/utils/object";
import { type BodyReader } from "./bodyController";
export * from "./bodyController";
export interface RequestMethodsWrapper {
    GET: true;
    POST: true;
    PUT: true;
    PATCH: true;
    DELETE: true;
    HEAD: true;
    OPTIONS: true;
    TRACE: true;
    CONNECT: true;
}
export type RequestMethods = GetPropsWithValue<RequestMethodsWrapper, true>;
export interface RequestInitializationData {
    readonly headers: Partial<Record<string, string | string[]>>;
    readonly host: string;
    readonly matchedPath: string | null;
    readonly method: string;
    readonly origin: string;
    readonly params: Record<string, string>;
    readonly path: string;
    readonly query: Record<string, string | string[]>;
    readonly url: string;
    readonly bodyReader: BodyReader;
}
declare const Request_base: new (params?: {
    "@DuplojsHttpCore/request"?: unknown;
} | undefined) => import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/request", unknown>, unknown> & import("@duplojs/utils").Kind<import("@duplojs/utils").KindDefinition<"request", unknown>, unknown>;
export declare class Request extends Request_base implements RequestInitializationData {
    method: string;
    headers: Partial<Record<string, string | string[]>>;
    url: string;
    host: string;
    origin: string;
    path: string;
    params: Record<string, string>;
    query: Record<string, string | string[]>;
    matchedPath: string | null;
    bodyReader: BodyReader;
    private bodyResult?;
    filesAttache: string[] | undefined;
    constructor({ method, headers, url, host, origin, path, params, query, matchedPath, bodyReader, ...rest }: RequestInitializationData);
    getBody(): MaybePromise<E.Success | E.Error>;
}
