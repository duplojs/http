import { DP, DPE, type IsEqual, type SimplifyTopLevel, type IsExtends, C } from "@duplojs/utils";
import "@duplojs/utils/clean";
interface ToEndpointSchemaParams {
    addEntityName?: boolean | string;
}
declare module "@duplojs/utils/clean" {
    interface EntityHandler<GenericName extends string = string, GenericPropertiesDefinition extends C.EntityPropertiesDefinition = C.EntityPropertiesDefinition> {
        toExtractParser<GenericEntityProperties extends C.EntityProperties<GenericPropertiesDefinition>, const GenericKey extends keyof GenericEntityProperties = keyof GenericEntityProperties>(keys?: GenericKey[]): ReturnType<typeof DPE.object<SimplifyTopLevel<{
            [Prop in GenericKey]: DP.Contract<GenericEntityProperties[Prop], unknown>;
        }>>>;
        toEndpointSchema<GenericEntityRawProperties extends C.EntityRawProperties<GenericPropertiesDefinition>, const GenericKey extends keyof GenericEntityRawProperties = keyof GenericEntityRawProperties, const GenericParams extends ToEndpointSchemaParams = {}>(keys?: GenericKey[], params?: GenericParams | ToEndpointSchemaParams): ReturnType<typeof DPE.object<SimplifyTopLevel<{
            [Prop in GenericKey]: DP.Contract<GenericEntityRawProperties[Prop], unknown>;
        } & (IsEqual<GenericParams["addEntityName"], true> extends true ? {
            [Prop in "_entityName"]: DP.Contract<GenericName, unknown>;
        } : {}) & (IsExtends<GenericParams["addEntityName"], string> extends true ? {
            [Prop in "_entityName"]: DP.Contract<`${GenericName}/${GenericParams["addEntityName"]}`, unknown>;
        } : {})>>>;
    }
}
export {};
