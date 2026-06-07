import { type Route } from "../../core/route";
import { DP } from "@duplojs/utils";
import { type ResponseContract } from "../../core/response";
import { type TransformerBuildFunction } from "@duplojs/data-parser-tools/toTypescript";
export interface RouteToDataParserParams {
    readonly defaultExtractContract: ResponseContract.Contract;
}
export declare const bodyAsFormData: TransformerBuildFunction;
export declare const convertRoutePath: (path: string) => DP.DataParserLiteral<{
    readonly value: readonly string[];
    readonly errorMessage?: string | undefined;
    readonly identifier?: string | undefined;
    readonly overrideTypescriptTransformer?: TransformerBuildFunction | undefined;
    readonly overrideJsonSchemaTransformer?: import("@duplojs/data-parser-tools/toJsonSchema").TransformerBuildFunction | undefined;
    readonly overrideDataParserTransformer?: import("@duplojs/data-parser-tools/toDataParser").TransformerBuildFunction | undefined;
    readonly checkers: readonly [];
}> | DP.DataParserTemplateLiteral<{
    readonly template: [string | DP.DataParserString<{
        readonly errorMessage?: string | undefined;
        readonly identifier?: string | undefined;
        readonly overrideTypescriptTransformer?: TransformerBuildFunction | undefined;
        readonly overrideJsonSchemaTransformer?: import("@duplojs/data-parser-tools/toJsonSchema").TransformerBuildFunction | undefined;
        readonly overrideDataParserTransformer?: import("@duplojs/data-parser-tools/toDataParser").TransformerBuildFunction | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>, string | DP.DataParserString<{
        readonly errorMessage?: string | undefined;
        readonly identifier?: string | undefined;
        readonly overrideTypescriptTransformer?: TransformerBuildFunction | undefined;
        readonly overrideJsonSchemaTransformer?: import("@duplojs/data-parser-tools/toJsonSchema").TransformerBuildFunction | undefined;
        readonly overrideDataParserTransformer?: import("@duplojs/data-parser-tools/toDataParser").TransformerBuildFunction | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>, ...(string | DP.DataParserString<{
        readonly errorMessage?: string | undefined;
        readonly identifier?: string | undefined;
        readonly overrideTypescriptTransformer?: TransformerBuildFunction | undefined;
        readonly overrideJsonSchemaTransformer?: import("@duplojs/data-parser-tools/toJsonSchema").TransformerBuildFunction | undefined;
        readonly overrideDataParserTransformer?: import("@duplojs/data-parser-tools/toDataParser").TransformerBuildFunction | undefined;
        readonly coerce: boolean;
        readonly checkers: readonly [];
    }>)[]];
    readonly errorMessage?: string | undefined;
    readonly identifier?: string | undefined;
    readonly overrideTypescriptTransformer?: TransformerBuildFunction | undefined;
    readonly overrideJsonSchemaTransformer?: import("@duplojs/data-parser-tools/toJsonSchema").TransformerBuildFunction | undefined;
    readonly overrideDataParserTransformer?: import("@duplojs/data-parser-tools/toDataParser").TransformerBuildFunction | undefined;
    readonly pattern: RegExp;
    readonly checkers: readonly [];
}>;
export declare function routeToDataParser(route: Route, params: RouteToDataParserParams): DP.DataParser[];
