'use strict';

var utils = require('@duplojs/utils');
var clean = require('@duplojs/utils/clean');

clean.createNewType.overrideHandler.setMethod("toExtractParser", (self) => {
    const constraintsKindValue = utils.pipe(self.constraints, utils.A.map(({ name }) => utils.O.entry(name, null)), utils.O.fromEntries);
    const valueContainer = clean.newTypeKind.setTo(clean.constrainedTypeKind.setTo({}, constraintsKindValue), self.name);
    const dataParser = utils.DPE.transform(self.dataParser, (input) => ({
        ...valueContainer,
        [utils.keyWrappedValue]: input,
    }));
    return dataParser;
});
clean.createNewType.overrideHandler.setMethod("toEndpointSchema", (self) => utils.DPE.lazy(() => self.dataParser));
