import { pipe, P, isType, innerPipe, A, asserts, DP, O, DPE } from '@duplojs/utils';
import { newTypeHandlerKind, createEntity } from '@duplojs/utils/clean';

function propertiesDefinitionToSchema(definition, method) {
    return pipe(definition, P.when(newTypeHandlerKind.has, (value) => value[method]()), P.when(isType("array"), innerPipe(A.map((element) => element[method]()), (options) => {
        asserts(options, A.minElements(1));
        return DP.union(options);
    })), P.otherwise((definition) => pipe(definition.type, (subDefinition) => propertiesDefinitionToSchema(subDefinition, method), (dataParser) => {
        if (definition.inArray) {
            return pipe(dataParser, DP.array, (dataParser) => typeof definition.inArray === "object"
                && typeof definition.inArray.min === "number"
                ? dataParser.addChecker(DP.checkerArrayMin(definition.inArray.min))
                : dataParser, (dataParser) => typeof definition.inArray === "object"
                && typeof definition.inArray.max === "number"
                ? dataParser.addChecker(DP.checkerArrayMax(definition.inArray.max))
                : dataParser);
        }
        return dataParser;
    }, (dataParser) => definition.nullable === true
        ? DP.nullable(dataParser)
        : dataParser)));
}
createEntity.overrideHandler.setMethod("toExtractParser", (self, keys) => pipe(self.propertiesDefinition, O.entries, A.filter(([key]) => keys === undefined || A.includes(keys, key)), A.map(([key, value]) => O.entry(key, propertiesDefinitionToSchema(value, "toExtractParser"))), O.fromEntries, DPE.object));
createEntity.overrideHandler.setMethod("toEndpointSchema", (self, keys, params) => pipe(self.propertiesDefinition, O.entries, A.filter(([key]) => keys === undefined || A.includes(keys, key)), A.map(([key, value]) => O.entry(key, propertiesDefinitionToSchema(value, "toEndpointSchema"))), O.fromEntries, (shape) => typeof params?.addEntityName !== "undefined"
    ? {
        ...shape,
        _entityName: typeof params.addEntityName === "string"
            ? DP.literal(`${self.name}/${params.addEntityName}`)
            : DP.literal(self.name),
    }
    : shape, DPE.object));
