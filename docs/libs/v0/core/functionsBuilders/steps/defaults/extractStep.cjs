'use strict';

require('../../../steps/index.cjs');
var utils = require('@duplojs/utils');
require('../../../response/index.cjs');
var create = require('../create.cjs');
var extract = require('../../../steps/extract.cjs');
var predicted = require('../../../response/predicted.cjs');

const defaultExtractStepFunctionBuilder = create.createStepFunctionBuilder(extract.extractStepKind.has, (step, { success, environment, defaultExtractContract }) => {
    const { shape, responseContract: stepResponseContract, } = step.definition;
    const responseContract = stepResponseContract ?? defaultExtractContract;
    function getResponse(result, key, subKey) {
        const response = new predicted.PredictedResponse(responseContract.code, responseContract.information, environment === "DEV"
            ? utils.unwrap(result)
            : undefined);
        return subKey === undefined
            ? response.setHeader("extract-key", `request.${key}`)
            : response.setHeader("extract-key", `request.${key}.${subKey}`);
    }
    function treatResult(result, floor, key, subKey) {
        if (utils.E.isLeft(result)) {
            return getResponse(result, key, subKey);
        }
        return {
            ...floor,
            [subKey ?? key]: utils.unwrap(result),
        };
    }
    const extractors = utils.A.reduce(utils.O.entries(shape), utils.A.reduceFrom([]), ({ lastValue, element: [key, value], next }) => next(utils.DP.dataParserKind.has(value)
        ? utils.A.push(lastValue, (request, floor) => treatResult(value.parse(request[key]), floor, key))
        : utils.pipe(value, utils.P.when(utils.isType("undefined"), utils.justReturn(lastValue)), utils.P.otherwise(utils.innerPipe(utils.O.entries, utils.A.map(([subKey, subValue]) => ((request, floor) => treatResult(subValue.parse(request[key]?.[subKey]), floor, key, subKey))), (subExtractor) => utils.A.concat(lastValue, subExtractor))))));
    return success({
        buildedFunction: (request, floor) => {
            let newFloor = floor;
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let index = 0; index < extractors.length; index++) {
                const result = extractors[index](request, newFloor);
                if (result instanceof predicted.PredictedResponse) {
                    return result;
                }
                newFloor = result;
            }
            return newFloor;
        },
        hooksRouteLifeCycle: [],
    });
});

exports.defaultExtractStepFunctionBuilder = defaultExtractStepFunctionBuilder;
