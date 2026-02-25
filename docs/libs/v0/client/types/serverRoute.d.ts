import { type SimplifyTopLevel, type MaybeArray, type IsEqual } from "@duplojs/utils";
import type * as SS from "@duplojs/utils/string";
export type ServerPrimitiveData = string | undefined | number | null | boolean;
export type ServerRouteHeaders = Record<string, ServerPrimitiveData | {
    toString(): string;
}>;
export type ServerRouteParams = Record<string, ServerPrimitiveData | {
    toString(): string;
}>;
export type ServerRouteQuery = Record<string, MaybeArray<ServerPrimitiveData | {
    toString(): string;
}>>;
export type ServerRouteBody = unknown;
export type ServerRouteResponseBody = unknown;
export interface ServerRouteResponse {
    code: SS.Number;
    information?: string;
    body?: ServerRouteResponseBody;
}
export interface ServerRoute {
    path: string;
    method: string;
    headers?: ServerRouteHeaders;
    params?: ServerRouteParams;
    query?: ServerRouteQuery;
    body?: ServerRouteBody;
    responses: ServerRouteResponse;
}
export type GetServerRoutePath<GenericServerRoute extends ServerRoute, GenericPath extends GenericServerRoute["path"]> = GenericServerRoute extends ServerRoute ? IsEqual<Extract<GenericPath, GenericServerRoute["path"]>, never> extends true ? never : GenericServerRoute["path"] : never;
export type AddPrefixPathServerRoute<GenericRoute extends ServerRoute, GenericPrefix extends string> = GenericRoute extends ServerRoute ? SimplifyTopLevel<{
    path: `${GenericPrefix}${GenericRoute["path"]}`;
} & Omit<GenericRoute, "path">> : never;
export type RemovePrefixPathServerRoute<GenericRoute extends ServerRoute, GenericPrefix extends string> = GenericRoute extends ServerRoute ? GenericRoute["path"] extends `${GenericPrefix}${infer InferredPathRest}` ? SimplifyTopLevel<{
    path: InferredPathRest;
} & Omit<GenericRoute, "path">> : GenericRoute : never;
export type FindServerRoute<GenericRoute extends ServerRoute, GenericMethod extends GenericRoute["method"], GenericPath extends Extract<GenericRoute, {
    method: GenericMethod;
}>["path"] = Extract<GenericRoute, {
    method: GenericMethod;
}>["path"]> = Extract<GenericRoute, {
    method: GenericMethod;
    path: GenericPath;
}>;
export type FindServerRouteResponse<GenericRoute extends ServerRoute, GenericKey extends "code" | "information", GenericValue extends GenericRoute["responses"][GenericKey] = GenericRoute["responses"][GenericKey]> = Extract<GenericRoute["responses"], {
    [Prop in GenericKey]: GenericValue;
}>;
