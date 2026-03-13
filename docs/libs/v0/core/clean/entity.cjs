'use strict';

var utils = require('@duplojs/utils');
require('@duplojs/utils/clean');

utils.C.createEntity.overrideHandler.setMethod("toExtractParser", (self, keys) => {
    if (typeof keys === "string") {
        return utils.C.entityPropertyDefinitionToDataParser(self.propertiesDefinition[keys], (newTypeHandler) => newTypeHandler.toExtractParser());
    }
    return utils.pipe(self.propertiesDefinition, utils.O.entries, utils.A.filter(([key]) => keys === undefined || utils.A.includes(keys, key)), utils.A.map(([key, value]) => utils.O.entry(key, utils.C.entityPropertyDefinitionToDataParser(value, (newTypeHandler) => newTypeHandler.toExtractParser()))), utils.O.fromEntries, utils.DPE.object);
});
utils.C.createEntity.overrideHandler.setMethod("toEndpointSchema", (self, keys, params) => {
    if (typeof keys === "string") {
        return utils.C.entityPropertyDefinitionToDataParser(self.propertiesDefinition[keys], (newTypeHandler) => newTypeHandler.toEndpointSchema());
    }
    return utils.pipe(self.propertiesDefinition, utils.O.entries, utils.A.filter(([key]) => keys === undefined || utils.A.includes(keys, key)), utils.A.map(([key, value]) => utils.O.entry(key, utils.C.entityPropertyDefinitionToDataParser(value, (newTypeHandler) => newTypeHandler.toEndpointSchema()))), utils.O.fromEntries, (shape) => typeof params?.addEntityName !== "undefined"
        ? {
            ...shape,
            _entityName: typeof params.addEntityName === "string"
                ? utils.DP.literal(`${self.name}/${params.addEntityName}`)
                : utils.DP.literal(self.name),
        }
        : shape, utils.DPE.object);
});
