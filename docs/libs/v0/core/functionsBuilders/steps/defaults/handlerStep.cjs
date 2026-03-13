'use strict';

require('../../../steps/index.cjs');
var create = require('../create.cjs');
var utils = require('@duplojs/utils');
require('../../../response/index.cjs');
var handler = require('../../../steps/handler.cjs');
var contract = require('../../../response/contract.cjs');
var predicted = require('../../../response/predicted.cjs');
var serverSentEventsPredicted = require('../../../response/serverSentEventsPredicted.cjs');

const defaultHandlerStepFunctionBuilder = create.createStepFunctionBuilder(handler.handlerStepKind.has, (step, { success }) => {
    const { responseContract, theFunction: handlerFunction, } = step.definition;
    const preparedContractResponse = utils.A.reduce(utils.A.coalescing(responseContract), utils.A.reduceFrom({}), ({ element, lastValue, nextWithObject }) => nextWithObject(lastValue, {
        [element.information]: element,
    }));
    const response = (information, body) => {
        const currentContract = preparedContractResponse[information];
        if (!currentContract
            || !contract.ResponseContract.contractKind.has(currentContract)) {
            throw new contract.ResponseContract.Error(information, "Contract not found.");
        }
        const result = currentContract.body.parse(body);
        if (utils.E.isLeft(result)) {
            throw new contract.ResponseContract.Error(information, utils.unwrap(result));
        }
        return new predicted.PredictedResponse(currentContract.code, information, body);
    };
    const serverSentEventsResponse = (information, startSendingEvents) => {
        const currentContract = preparedContractResponse[information];
        if (!currentContract
            || !contract.ResponseContract.serverSentEventsContractKind.has(currentContract)) {
            throw new contract.ResponseContract.Error(information, "Contract not found.");
        }
        return new serverSentEventsPredicted.ServerSentEventsPredictedResponse(currentContract.code, information, (params) => startSendingEvents({
            ...params,
            send: (event, data, sendParams) => {
                const dataParser = currentContract.events[event];
                if (!dataParser) {
                    console.error(new contract.ResponseContract.Error(information, `Event '${event}' not found.`));
                    return Promise.resolve();
                }
                const result = dataParser.parse(data);
                if (utils.E.isLeft(result)) {
                    console.error(new contract.ResponseContract.Error(information, utils.unwrap(result)));
                    return Promise.resolve();
                }
                return params.send(event, data, sendParams);
            },
        }));
    };
    return success({
        buildedFunction: async (request, floor) => handlerFunction(floor, {
            request,
            response,
            serverSentEventsResponse,
        }),
        hooksRouteLifeCycle: [],
    });
});

exports.defaultHandlerStepFunctionBuilder = defaultHandlerStepFunctionBuilder;
