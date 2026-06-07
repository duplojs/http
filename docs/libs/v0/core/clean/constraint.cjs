'use strict';

var utils = require('@duplojs/utils');
require('@duplojs/utils/clean');

utils.C.createConstraint.overrideHandler.setMethod("toExtractParser", (self, params) => {
    const innerDataParser = utils.C.toMapDataParser(self, params);
    return utils.DPE.lazy(() => innerDataParser);
});
utils.C.createConstraint.overrideHandler.setMethod("toEndpointSchema", (self) => {
    const innerDataParser = self.internal.dataParser;
    return utils.DPE.lazy(() => innerDataParser);
});
