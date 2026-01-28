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
        const result = currentContract.body.parse(body);
        if (utils.E.isLeft(result)) {
            throw new contract.ResponseContract.Error(information, utils.unwrap(result));
        }
        return new predicted.PredictedResponse(currentContract.code, currentContract.information, body);
    };
    return success({
        buildedFunction: (request, floor) => handlerFunction(floor, {
            request,
            response,
        }),
        hooksRouteLifeCycle: [],
    });
});

exports.defaultHandlerStepFunctionBuilder = defaultHandlerStepFunctionBuilder;
