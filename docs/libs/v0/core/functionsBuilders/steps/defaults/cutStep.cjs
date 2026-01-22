'use strict';

require('../../../steps/index.cjs');
var create = require('../create.cjs');
var utils = require('@duplojs/utils');
require('../../../response/index.cjs');
var cut = require('../../../steps/cut.cjs');
var contract = require('../../../response/contract.cjs');
var predicted = require('../../../response/predicted.cjs');

const defaultCutStepFunctionBuilder = create.createStepFunctionBuilder(cut.cutStepKind.has, (step, { success }) => {
    const { responseContract, theFunction: cutFunction, } = step.definition;
    const output = (data) => cut.cutStepOutputKind.setTo(utils.wrapValue(data ?? {}));
    const preparedContractResponse = utils.A.reduce(utils.A.coalescing(responseContract), utils.A.reduceFrom({}), ({ element, lastValue, nextWithObject }) => nextWithObject(lastValue, {
        [element.information]: element,
    }));
    const response = (information, body) => {
        const currentContract = preparedContractResponse[information];
        if (!currentContract) {
            throw new contract.ResponseContract.Error(information);
        }
        const result = currentContract.body.parse(body);
        if (utils.E.isLeft(result)) {
            throw new contract.ResponseContract.Error(information, utils.unwrap(result));
        }
        return new predicted.PredictedResponse(currentContract.code, currentContract.information, body);
    };
    function treatResult(result, floor) {
        if (cut.cutStepOutputKind.has(result)) {
            return {
                ...floor,
                ...utils.unwrap(result),
            };
        }
        return result;
    }
    return success({
        buildedFunction: (request, floor) => {
            const result = cutFunction(floor, {
                request,
                output,
                response,
            });
            if (result instanceof Promise) {
                return result.then((awaitedResult) => treatResult(awaitedResult, floor));
            }
            return treatResult(result, floor);
        },
        hooksRouteLifeCycle: [],
    });
});

exports.defaultCutStepFunctionBuilder = defaultCutStepFunctionBuilder;
