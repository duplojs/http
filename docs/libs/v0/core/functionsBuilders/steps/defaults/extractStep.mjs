import '../../../steps/index.mjs';
import { unwrap, E, A, O, DP, pipe, P, isType, justReturn, innerPipe } from '@duplojs/utils';
import '../../../response/index.mjs';
import { createStepFunctionBuilder } from '../create.mjs';
import { extractStepKind } from '../../../steps/extract.mjs';
import { PredictedResponse } from '../../../response/predicted.mjs';

const defaultExtractStepFunctionBuilder = createStepFunctionBuilder(extractStepKind.has, (step, { success, environment, defaultExtractContract }) => {
    const { shape, responseContract: stepResponseContract, } = step.definition;
    const responseContract = stepResponseContract ?? defaultExtractContract;
    function getResponse(result, key, subKey) {
        const response = new PredictedResponse(responseContract.code, responseContract.information, environment === "DEV"
            ? unwrap(result)
            : undefined);
        return subKey === undefined
            ? response.setHeader("extract-key", `request.${key}`)
            : response.setHeader("extract-key", `request.${key}.${subKey}`);
    }
    function treatResult(result, floor, key, subKey) {
        if (E.isLeft(result)) {
            return getResponse(result, key, subKey);
        }
        return {
            ...floor,
            [subKey ?? key]: unwrap(result),
        };
    }
    const extractors = A.reduce(O.entries(shape), A.reduceFrom([]), ({ lastValue, element: [key, value], next }) => next(DP.dataParserKind.has(value)
        ? A.push(lastValue, (request, floor) => treatResult(value.parse(request[key]), floor, key))
        : pipe(value, P.when(isType("undefined"), justReturn(lastValue)), P.otherwise(innerPipe(O.entries, A.map(([subKey, subValue]) => ((request, floor) => treatResult(subValue.parse(request[key]?.[subKey]), floor, key, subKey))), (subExtractor) => A.concat(lastValue, subExtractor))))));
    return success({
        buildedFunction: (request, floor) => {
            let newFloor = floor;
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let index = 0; index < extractors.length; index++) {
                const result = extractors[index](request, newFloor);
                if (result instanceof PredictedResponse) {
                    return result;
                }
                newFloor = result;
            }
            return newFloor;
        },
        hooksRouteLifeCycle: [],
    });
});

export { defaultExtractStepFunctionBuilder };
