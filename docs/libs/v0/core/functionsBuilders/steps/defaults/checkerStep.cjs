'use strict';

var checker$1 = require('../../../checker.cjs');
var create = require('../create.cjs');
require('../../../steps/index.cjs');
var utils = require('@duplojs/utils');
require('../../../response/index.cjs');
var checker = require('../../../steps/checker.cjs');
var presetChecker = require('../../../steps/presetChecker.cjs');
var predicted = require('../../../response/predicted.cjs');

const defaultCheckerStepFunctionBuilder = create.createStepFunctionBuilder((element) => checker.checkerStepKind.has(element) || presetChecker.presetCheckerStepKind.has(element), (step, { success }) => {
    const { checkerOptions, checkerFunction, input, responseContract, stepResult, indexing, stepOptions, } = utils.pipe(step, utils.P.when(checker.checkerStepKind.has, ({ definition }) => ({
        checkerOptions: definition.checker.definition.options,
        checkerFunction: definition.checker.definition.theFunction,
        input: definition.input,
        responseContract: definition.responseContract,
        stepResult: definition.result,
        indexing: definition.indexing,
        stepOptions: definition.options,
    })), utils.P.when(presetChecker.presetCheckerStepKind.has, ({ definition }) => ({
        checkerOptions: definition.presetChecker.definition.checker.definition.options,
        checkerFunction: definition.presetChecker.definition.checker.definition.theFunction,
        input: definition.input,
        responseContract: definition.presetChecker.definition.responseContract,
        stepResult: definition.presetChecker.definition.result,
        indexing: definition.presetChecker.definition.indexing,
        stepOptions: definition.presetChecker.definition.options,
    })), utils.P.exhaustive);
    const getOptions = utils.pipe(stepOptions ?? checkerOptions, utils.P.when(utils.or([
        utils.isType("object"),
        utils.isType("undefined"),
    ]), (options) => (() => options)), utils.P.otherwise(utils.forward));
    const output = (information, value) => checker$1.checkerOutputKind.setTo({
        information,
        value,
    });
    const expectedResult = utils.pipe(stepResult, utils.P.when(utils.isType("string"), (expectedInformation) => ((information) => information === expectedInformation)), utils.P.otherwise((expectedInformation) => ((information) => expectedInformation.includes(information))));
    function getResponse() {
        return new predicted.PredictedResponse(responseContract.code, responseContract.information, undefined);
    }
    function treatResult(output, floor) {
        if (!expectedResult(output.information)) {
            return getResponse();
        }
        if (indexing) {
            return {
                ...floor,
                [indexing]: output.value,
            };
        }
        return floor;
    }
    return success({
        buildedFunction: (_request, floor) => {
            const result = checkerFunction(input(floor), {
                options: getOptions(floor),
                output,
            });
            if (result instanceof Promise) {
                return result.then((awaitedResult) => treatResult(awaitedResult, floor));
            }
            return treatResult(result, floor);
        },
        hooksRouteLifeCycle: [],
    });
});

exports.defaultCheckerStepFunctionBuilder = defaultCheckerStepFunctionBuilder;
