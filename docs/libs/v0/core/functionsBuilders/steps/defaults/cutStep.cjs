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
            throw new contract.ResponseContract.Error(information, "Contract not found.");
        }
        return new predicted.PredictedResponse(currentContract.code, currentContract.information, body);
    };
    return success({
        buildedFunction: async (request, floor) => {
            const cutResult = await cutFunction(floor, {
                request,
                output,
                response,
            });
            if (cutResult instanceof predicted.PredictedResponse) {
                const currentContract = preparedContractResponse[cutResult.information];
                const resultBody = currentContract.body.isAsynchronous()
                    ? await currentContract.body.asyncParse(cutResult.body)
                    : currentContract.body.parse(cutResult.body);
                if (utils.E.isLeft(resultBody)) {
                    throw new contract.ResponseContract.Error(cutResult.information, utils.unwrap(resultBody));
                }
                return cutResult;
            }
            return {
                ...floor,
                ...utils.unwrap(cutResult),
            };
        },
        hooksRouteLifeCycle: [],
    });
});

exports.defaultCutStepFunctionBuilder = defaultCutStepFunctionBuilder;
