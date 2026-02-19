import { A, pipe, O, DPE, keyWrappedValue } from '@duplojs/utils';
import { createConstraintsSet, constrainedTypeKind } from '@duplojs/utils/clean';

createConstraintsSet.overrideHandler.setMethod("toExtractParser", (self) => {
    const checkers = A.flatMap(self.constraints, ({ checkers }) => checkers);
    const dataParserWithCheckers = self
        .primitiveHandler
        .dataParser
        .addChecker(...checkers);
    const constraintsKindValue = pipe(self.constraints, A.map(({ name }) => O.entry(name, null)), O.fromEntries);
    const valueContainer = constrainedTypeKind.setTo({}, constraintsKindValue);
    const dataParser = DPE.transform(dataParserWithCheckers, (input) => ({
        ...valueContainer,
        [keyWrappedValue]: input,
    }));
    return dataParser;
});
createConstraintsSet.overrideHandler.setMethod("toEndpointSchema", (self) => {
    const checkers = A.flatMap(self.constraints, ({ checkers }) => checkers);
    const dataParserWithCheckers = self
        .primitiveHandler
        .dataParser
        .addChecker(...checkers);
    return DPE.lazy(() => dataParserWithCheckers);
});
