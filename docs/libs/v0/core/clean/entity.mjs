import { C, pipe, O, A, DPE, DP } from '@duplojs/utils';
import '@duplojs/utils/clean';

C.createEntity.overrideHandler.setMethod("toExtractParser", (self, keys, params) => {
    if (typeof keys === "string") {
        return C.entityPropertyDefinitionToDataParser(self.propertiesDefinition[keys], (newTypeHandler) => newTypeHandler.toExtractParser(params));
    }
    return pipe(self.propertiesDefinition, O.entries, A.filter(([key]) => keys === undefined || A.includes(keys, key)), A.map(([key, value]) => O.entry(key, C.entityPropertyDefinitionToDataParser(value, (newTypeHandler) => newTypeHandler.toExtractParser(params)))), O.fromEntries, DPE.object);
});
C.createEntity.overrideHandler.setMethod("toEndpointSchema", (self, keys, params) => {
    if (typeof keys === "string") {
        return C.entityPropertyDefinitionToDataParser(self.propertiesDefinition[keys], (newTypeHandler) => newTypeHandler.toEndpointSchema());
    }
    return pipe(self.propertiesDefinition, O.entries, A.filter(([key]) => keys === undefined || A.includes(keys, key)), A.map(([key, value]) => O.entry(key, C.entityPropertyDefinitionToDataParser(value, (newTypeHandler) => newTypeHandler.toEndpointSchema()))), O.fromEntries, (shape) => typeof params?.addEntityName !== "undefined"
        ? {
            ...shape,
            _entityName: typeof params.addEntityName === "string"
                ? DP.literal(`${self.name}/${params.addEntityName}`)
                : DP.literal(self.name),
        }
        : shape, DPE.object);
});
