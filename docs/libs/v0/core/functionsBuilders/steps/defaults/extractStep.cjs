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
    function createExtractor(parser, key, subKey) {
        const createResponse = environment === "DEV"
            ? (result) => new predicted.PredictedResponse(responseContract.code, responseContract.information, result)
            : () => new predicted.PredictedResponse(responseContract.code, responseContract.information, undefined);
        const setHeader = subKey === undefined || key === "body"
            ? (response) => response.setHeader("extract-key", `request.${key}`)
            : (response) => response.setHeader("extract-key", `request.${key}.${subKey}`);
        const getResponse = (result) => setHeader(createResponse(result));
        const treatResult = (result, floor) => utils.E.isLeft(result)
            ? getResponse(utils.unwrap(result))
            : {
                ...floor,
                [subKey ?? key]: utils.unwrap(result),
            };
        const getValue = typeof subKey === "string"
            ? (value) => value?.[subKey]
            : utils.forward;
        if (key === "body") {
            const parseFunction = parser.isAsynchronous()
                ? parser.asyncParse
                : parser.parse;
            return async (request, floor) => {
                const bodyResult = await request.getBody();
                if (utils.E.isLeft(bodyResult)) {
                    return treatResult(bodyResult, floor);
                }
                const result = await parseFunction(getValue(utils.unwrap(bodyResult)));
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
    const extractors = utils.A.reduce(utils.O.entries(shape), utils.A.reduceFrom([]), ({ lastValue, element: [key, value], next, }) => utils.pipe(value, utils.P.when(utils.DP.dataParserKind.has, (value) => utils.A.push(lastValue, createExtractor(value, key, undefined))), utils.P.otherwise((value) => utils.pipe(value, utils.P.when(utils.isType("undefined"), utils.justReturn(lastValue)), utils.P.otherwise(utils.innerPipe(utils.O.entries, utils.A.map(([subKey, subValue]) => createExtractor(subValue, key, subKey)), (subExtractor) => utils.A.concat(lastValue, subExtractor))))), next));
    return success({
        buildedFunction: async (request, floor) => {
            let newFloor = floor;
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let index = 0; index < extractors.length; index++) {
                const result = await extractors[index](request, newFloor);
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
