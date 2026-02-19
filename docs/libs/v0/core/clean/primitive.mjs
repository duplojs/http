import { DPE, keyWrappedValue } from '@duplojs/utils';
import { createPrimitive } from '@duplojs/utils/clean';

createPrimitive.overrideHandler.setMethod("toExtractParser", (self) => {
    const dataParser = DPE.transform(self.dataParser, (input) => ({
        [keyWrappedValue]: input,
    }));
    return dataParser;
});
createPrimitive.overrideHandler.setMethod("toEndpointSchema", (self) => DPE.lazy(() => self.dataParser));
