import '../../../steps/index.mjs';
import { E, unwrap, forward, A, O, pipe, P, DP, isType, justReturn, innerPipe } from '@duplojs/utils';
import '../../../response/index.mjs';
import { createStepFunctionBuilder } from '../create.mjs';
import { extractStepKind } from '../../../steps/extract.mjs';
import { PredictedResponse } from '../../../response/predicted.mjs';

const defaultExtractStepFunctionBuilder = createStepFunctionBuilder(extractStepKind.has, (step, { success, environment, defaultExtractContract }) => {
    const { shape, responseContract: stepResponseContract, } = step.definition;
    const responseContract = stepResponseContract ?? defaultExtractContract;
    function createExtractor(parser, key, subKey) {
        const createResponse = environment === "DEV"
            ? (result) => new PredictedResponse(responseContract.code, responseContract.information, result)
            : () => new PredictedResponse(responseContract.code, responseContract.information, undefined);
        const setHeader = subKey === undefined || key === "body"
            ? (response) => response.setHeader("extract-key", `request.${key}`)
            : (response) => response.setHeader("extract-key", `request.${key}.${subKey}`);
        const getResponse = (result) => setHeader(createResponse(result));
        const treatResult = (result, floor) => E.isLeft(result)
            ? getResponse(unwrap(result))
            : {
                ...floor,
                [subKey ?? key]: unwrap(result),
            };
        const getValue = typeof subKey === "string"
            ? (value) => value?.[subKey]
            : forward;
        if (key === "body") {
            const parseFunction = parser.isAsynchronous()
                ? parser.asyncParse
                : parser.parse;
            return async (request, floor) => {
                const bodyResult = await request.getBody();
                if (E.isLeft(bodyResult)) {
                    return treatResult(bodyResult, floor);
                }
                const result = await parseFunction(getValue(unwrap(bodyResult)));
                return treatResult(result, floor);
            };
        }
        if (parser.isAsynchronous()) {
            const parseFunction = parser.asyncParse;
            return async (request, floor) => {
                const result = await parseFunction(getValue(request[key]));
                return treatResult(result, floor);
            };
        }
        const parseFunction = parser.parse;
        return (request, floor) => {
            const result = parseFunction(getValue(request[key]));
            return treatResult(result, floor);
        };
    }
    const extractors = A.reduce(O.entries(shape), A.reduceFrom([]), ({ lastValue, element: [key, value], next, }) => pipe(value, P.when(DP.dataParserKind.has, (value) => A.push(lastValue, createExtractor(value, key, undefined))), P.otherwise((value) => pipe(value, P.when(isType("undefined"), justReturn(lastValue)), P.otherwise(innerPipe(O.entries, A.map(([subKey, subValue]) => createExtractor(subValue, key, subKey)), (subExtractor) => A.concat(lastValue, subExtractor))))), next));
    return success({
        buildedFunction: async (request, floor) => {
            let newFloor = floor;
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let index = 0; index < extractors.length; index++) {
                const result = await extractors[index](request, newFloor);
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
