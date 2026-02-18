import { pipe, A, O, DPE, keyWrappedValue } from '@duplojs/utils';
import { createNewType, newTypeKind, constrainedTypeKind } from '@duplojs/utils/clean';

createNewType.overrideHandler.setMethod("toExtractParser", (self) => {
    const constraintsKindValue = pipe(self.constraints, A.map(({ name }) => O.entry(name, null)), O.fromEntries);
    const valueContainer = newTypeKind.setTo(constrainedTypeKind.setTo({}, constraintsKindValue), self.name);
    const dataParser = DPE.transform(self.dataParser, (input) => ({
        ...valueContainer,
        [keyWrappedValue]: input,
    }));
    return dataParser;
});
createNewType.overrideHandler.setMethod("toEndpointSchema", (self) => DPE.lazy(() => self.dataParser));
