'use strict';

var utils = require('@duplojs/utils');
var clean = require('@duplojs/utils/clean');

function propertiesDefinitionToSchema(definition, method) {
    return utils.pipe(definition, utils.P.when(clean.newTypeHandlerKind.has, (value) => value[method]()), utils.P.when(utils.isType("array"), utils.innerPipe(utils.A.map((element) => element[method]()), (options) => {
        utils.asserts(options, utils.A.minElements(1));
        return utils.DP.union(options);
    })), utils.P.otherwise((definition) => utils.pipe(definition.type, (subDefinition) => propertiesDefinitionToSchema(subDefinition, method), (dataParser) => {
        if (definition.inArray) {
            return utils.pipe(dataParser, utils.DP.array, (dataParser) => typeof definition.inArray === "object"
                && typeof definition.inArray.min === "number"
                ? dataParser.addChecker(utils.DP.checkerArrayMin(definition.inArray.min))
                : dataParser, (dataParser) => typeof definition.inArray === "object"
                && typeof definition.inArray.max === "number"
                ? dataParser.addChecker(utils.DP.checkerArrayMax(definition.inArray.max))
                : dataParser);
        }
        return dataParser;
    }, (dataParser) => definition.nullable === true
        ? utils.DP.nullable(dataParser)
        : dataParser)));
}
clean.createEntity.overrideHandler.setMethod("toExtractParser", (self, keys) => utils.pipe(self.propertiesDefinition, utils.O.entries, utils.A.filter(([key]) => keys === undefined || utils.A.includes(keys, key)), utils.A.map(([key, value]) => utils.O.entry(key, propertiesDefinitionToSchema(value, "toExtractParser"))), utils.O.fromEntries, utils.DPE.object));
clean.createEntity.overrideHandler.setMethod("toEndpointSchema", (self, keys, params) => utils.pipe(self.propertiesDefinition, utils.O.entries, utils.A.filter(([key]) => keys === undefined || utils.A.includes(keys, key)), utils.A.map(([key, value]) => utils.O.entry(key, propertiesDefinitionToSchema(value, "toEndpointSchema"))), utils.O.fromEntries, (shape) => typeof params?.addEntityName !== "undefined"
    ? {
        ...shape,
        _entityName: typeof params.addEntityName === "string"
            ? utils.DP.literal(`${self.name}/${params.addEntityName}`)
            : utils.DP.literal(self.name),
    }
    : shape, utils.DPE.object));
