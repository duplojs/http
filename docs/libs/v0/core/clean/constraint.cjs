'use strict';

var utils = require('@duplojs/utils');
var clean = require('@duplojs/utils/clean');

clean.createConstraint.overrideHandler.setMethod("toExtractParser", (self) => {
    const dataParserWithCheckers = self
        .primitiveHandler
        .dataParser
        .addChecker(...self.checkers);
    const valueContainer = clean.constrainedTypeKind.setTo({}, { [self.name]: null });
    const dataParser = utils.DPE.transform(dataParserWithCheckers, (input) => ({
        ...valueContainer,
        [utils.keyWrappedValue]: input,
    }));
    return dataParser;
});
clean.createConstraint.overrideHandler.setMethod("toEndpointSchema", (self) => {
    const dataParser = self
        .primitiveHandler
        .dataParser
        .addChecker(...self.checkers);
    return utils.DPE.lazy(() => dataParser);
});
