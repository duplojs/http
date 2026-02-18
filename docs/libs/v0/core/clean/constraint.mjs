import { DPE, keyWrappedValue } from '@duplojs/utils';
import { createConstraint, constrainedTypeKind } from '@duplojs/utils/clean';

createConstraint.overrideHandler.setMethod("toExtractParser", (self) => {
    const dataParserWithCheckers = self
        .primitiveHandler
        .dataParser
        .addChecker(...self.checkers);
    const valueContainer = constrainedTypeKind.setTo({}, { [self.name]: null });
    const dataParser = DPE.transform(dataParserWithCheckers, (input) => ({
        ...valueContainer,
        [keyWrappedValue]: input,
    }));
    return dataParser;
});
createConstraint.overrideHandler.setMethod("toEndpointSchema", (self) => {
    const dataParser = self
        .primitiveHandler
        .dataParser
        .addChecker(...self.checkers);
    return DPE.lazy(() => dataParser);
});
