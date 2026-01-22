import type { Route } from "../../core/route";
import type { ResponseCode, ResponseContract } from "../../core/response";
import { type MapContext, type JsonSchema } from "@duplojs/data-parser-tools/toJsonSchema";
import type { EndpointResponse, EntrypointParameter } from "./types";
export type ResultSchemaContext = Map<string, Record<string, JsonSchema>>;
export interface RouteToOpenApiParams {
    readonly contextToJsonSchemaFactory: MapContext;
    readonly resultSchemaContext: ResultSchemaContext;
    readonly defaultExtractContract: ResponseContract.Contract;
}
export declare function routeToOpenApi(route: Route, params: RouteToOpenApiParams): {
    path: `/${string}`;
    method: "options" | "get" | "post" | "put" | "delete" | "head" | "trace" | "connect";
    parameters: EntrypointParameter[];
    requestBody: {
        required: true;
        content: {
            "application/json": {
                schema: {
                    $ref: `#/components/schemas/${string}`;
                };
            };
        };
    } | {
        required: true;
        content: {
            "text/plain": {
                schema: {
                    $ref: `#/components/schemas/${string}`;
                };
            };
        };
    } | undefined;
    responses: Partial<Record<ResponseCode, EndpointResponse>>;
}[];
