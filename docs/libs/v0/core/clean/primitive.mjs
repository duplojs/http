import { C, DPE } from '@duplojs/utils';
import '@duplojs/utils/clean';

C.createPrimitive.overrideHandler.setMethod("toExtractParser", (self, params) => {
    const innerDataParser = C.toMapDataParser(self, params);
    return DPE.lazy(() => innerDataParser);
});
C.createPrimitive.overrideHandler.setMethod("toEndpointSchema", (self) => {
    const innerDataParser = self.dataParser;
    return DPE.lazy(() => innerDataParser);
});
