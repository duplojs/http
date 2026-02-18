'use strict';

var utils = require('@duplojs/utils');
var clean = require('@duplojs/utils/clean');

clean.createPrimitive.overrideHandler.setMethod("toExtractParser", (self) => {
    const dataParser = utils.DPE.transform(self.dataParser, (input) => ({
        [utils.keyWrappedValue]: input,
    }));
    return dataParser;
});
clean.createPrimitive.overrideHandler.setMethod("toEndpointSchema", (self) => utils.DPE.lazy(() => self.dataParser));
