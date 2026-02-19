import { DP, DPE, type IsEqual, type SimplifyTopLevel, type IsExtends } from "@duplojs/utils";
import { type EntityRawProperties, type EntityProperties, type EntityPropertiesDefinition } from "@duplojs/utils/clean";
interface ToEndpointSchemaParams {
    addEntityName?: boolean | string;
}
declare module "@duplojs/utils/clean" {
    interface EntityHandler<GenericName extends string = string, GenericPropertiesDefinition extends EntityPropertiesDefinition = EntityPropertiesDefinition> {
        toExtractParser<GenericEntityProperties extends EntityProperties<GenericPropertiesDefinition>, const GenericKey extends keyof GenericEntityProperties = keyof GenericEntityProperties>(keys?: GenericKey[]): ReturnType<typeof DPE.object<{
            [Prop in GenericKey]: DP.Contract<GenericEntityProperties[Prop], unknown>;
        }>>;
        toEndpointSchema<GenericEntityRawProperties extends EntityRawProperties<GenericPropertiesDefinition>, const GenericKey extends keyof GenericEntityRawProperties = keyof GenericEntityRawProperties, const GenericParams extends ToEndpointSchemaParams = {}>(keys?: GenericKey[], params?: GenericParams | ToEndpointSchemaParams): ReturnType<typeof DPE.object<SimplifyTopLevel<{
            [Prop in GenericKey]: DP.Contract<GenericEntityRawProperties[Prop], unknown>;
        } & (IsEqual<GenericParams["addEntityName"], true> extends true ? {
            [Prop in "_entityName"]: DP.Contract<GenericName, unknown>;
        } : {}) & (IsExtends<GenericParams["addEntityName"], string> extends true ? {
            [Prop in "_entityName"]: DP.Contract<`${GenericName}/${GenericParams["addEntityName"]}`, unknown>;
        } : {})>>>;
    }
}
export {};
