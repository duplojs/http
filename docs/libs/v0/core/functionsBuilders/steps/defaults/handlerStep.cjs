'use strict';

require('../../../steps/index.cjs');
var create = require('../create.cjs');
var utils = require('@duplojs/utils');
require('../../../response/index.cjs');
var handler = require('../../../steps/handler.cjs');
var contract = require('../../../response/contract.cjs');
var predicted = require('../../../response/predicted.cjs');

const defaultHandlerStepFunctionBuilder = create.createStepFunctionBuilder(handler.handlerStepKind.has, (step, { success }) => {
    const { responseContract, theFunction: handlerFunction, } = step.definition;
    const preparedContractResponse = utils.A.reduce(utils.A.coalescing(responseContract), utils.A.reduceFrom({}), ({ element, lastValue, nextWithObject }) => nextWithObject(lastValue, {
        [element.information]: element,
    }));
    const response = (information, body) => {
        const currentContract = preparedContractResponse[information];
        if (!currentContract) {
            throw new contract.ResponseContract.Error(information);
        }
        return new predicted.PredictedResponse(currentContract.code, currentContract.information, body);
    };
    return success({
        buildedFunction: async (request, floor) => {
            const predictedResponse = await handlerFunction(floor, {
                request,
                response,
            });
            const currentContract = preparedContractResponse[predictedResponse.information];
            const result = currentContract.body.isAsynchronous()
                ? await currentContract.body.asyncParse(predictedResponse.body)
                : currentContract.body.parse(predictedResponse.body);
            if (utils.E.isLeft(result)) {
                throw new contract.ResponseContract.Error(predictedResponse.information, utils.unwrap(result));
            }
            return predictedResponse;
        },
        hooksRouteLifeCycle: [],
    });
});

exports.defaultHandlerStepFunctionBuilder = defaultHandlerStepFunctionBuilder;
