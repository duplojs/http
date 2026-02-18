'use strict';

var utils = require('@duplojs/utils');
var clean = require('@duplojs/utils/clean');

clean.createConstraintsSet.overrideHandler.setMethod("toExtractParser", (self) => {
    const checkers = utils.A.flatMap(self.constraints, ({ checkers }) => checkers);
    const dataParserWithCheckers = self
        .primitiveHandler
        .dataParser
        .addChecker(...checkers);
    const constraintsKindValue = utils.pipe(self.constraints, utils.A.map(({ name }) => utils.O.entry(name, null)), utils.O.fromEntries);
    const valueContainer = clean.constrainedTypeKind.setTo({}, constraintsKindValue);
    const dataParser = utils.DPE.transform(dataParserWithCheckers, (input) => ({
        ...valueContainer,
        [utils.keyWrappedValue]: input,
    }));
    return dataParser;
});
clean.createConstraintsSet.overrideHandler.setMethod("toEndpointSchema", (self) => {
    const checkers = utils.A.flatMap(self.constraints, ({ checkers }) => checkers);
    const dataParserWithCheckers = self
        .primitiveHandler
        .dataParser
        .addChecker(...checkers);
    return utils.DPE.lazy(() => dataParserWithCheckers);
});
