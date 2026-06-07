import { DP, DPE, type IsEqual, type SimplifyTopLevel, type IsExtends, C, type MaybeArray } from "@duplojs/utils";
import "@duplojs/utils/clean";
interface ToExtractParserParams {
    coerce?: boolean;
}
interface ToEndpointSchemaParams {
    addEntityName?: boolean | string;
}
declare module "@duplojs/utils/clean" {
    interface EntityHandler<GenericName extends string = string, GenericPropertiesDefinition extends C.EntityPropertiesDefinition = C.EntityPropertiesDefinition> {
        toExtractParser<GenericEntityProperties extends C.EntityProperties<GenericPropertiesDefinition>, const GenericKey extends MaybeArray<keyof GenericEntityProperties> = readonly (keyof GenericEntityProperties)[]>(keys?: GenericKey, params?: ToExtractParserParams): GenericKey extends readonly any[] ? ReturnType<typeof DPE.object<SimplifyTopLevel<{
            [Prop in GenericKey[number]]: DP.DataParserExtended<GenericEntityProperties[Prop], unknown>;
        }>>> : DP.DataParser<GenericEntityProperties[Extract<GenericKey, string>], unknown>;
        toEndpointSchema<GenericEntityRawProperties extends C.EntityRawProperties<GenericPropertiesDefinition>, const GenericKey extends MaybeArray<keyof GenericEntityRawProperties> = readonly (keyof GenericEntityRawProperties)[], const GenericParams extends (ToEndpointSchemaParams) = {}>(keys?: GenericKey, params?: (GenericParams | ToEndpointSchemaParams) & (GenericKey extends string ? never : unknown)): GenericKey extends readonly any[] ? ReturnType<typeof DPE.object<SimplifyTopLevel<{
            [Prop in GenericKey[number]]: DP.DataParser<GenericEntityRawProperties[Prop], unknown>;
        } & (IsEqual<GenericParams["addEntityName"], true> extends true ? {
            [Prop in "_entityName"]: DP.DataParser<GenericName, unknown>;
        } : {}) & (IsExtends<GenericParams["addEntityName"], string> extends true ? {
            [Prop in "_entityName"]: DP.DataParser<`${GenericName}/${GenericParams["addEntityName"]}`, unknown>;
        } : {})>>> : DP.DataParser<GenericEntityRawProperties[Extract<GenericKey, string>], unknown>;
    }
}
export {};
