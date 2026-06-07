import { C, DPE } from '@duplojs/utils';
import '@duplojs/utils/clean';

C.createNewType.overrideHandler.setMethod("toExtractParser", (self, params) => {
    const innerDataParser = C.toMapDataParser(self, params);
    return DPE.lazy(() => innerDataParser);
});
C.createNewType.overrideHandler.setMethod("toEndpointSchema", (self) => {
    const innerDataParser = self.internal.dataParser;
    return DPE.lazy(() => innerDataParser);
});
