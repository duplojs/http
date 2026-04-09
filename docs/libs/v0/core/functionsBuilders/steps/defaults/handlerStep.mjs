import '../../../steps/index.mjs';
import { createStepFunctionBuilder } from '../create.mjs';
import { A, E, unwrap } from '@duplojs/utils';
import '../../../response/index.mjs';
import { handlerStepKind } from '../../../steps/handler.mjs';
import { ResponseContract } from '../../../response/contract.mjs';
import { PredictedResponse } from '../../../response/predicted.mjs';
import { ServerSentEventsPredictedResponse } from '../../../response/serverSentEventsPredicted.mjs';
import { StreamPredictedResponse } from '../../../response/streamPredicted.mjs';
import { StreamTextPredictedResponse } from '../../../response/streamTextPredicted.mjs';

/* eslint-disable @typescript-eslint/prefer-for-of */
const defaultHandlerStepFunctionBuilder = createStepFunctionBuilder(handlerStepKind.has, (step, { success }) => {
    const { responseContract, theFunction: handlerFunction, } = step.definition;
    const preparedContractResponse = A.reduce(A.coalescing(responseContract), A.reduceFrom({}), ({ element, lastValue, nextWithObject }) => nextWithObject(lastValue, {
        [element.information]: element,
    }));
    const response = (information, body) => {
        const currentContract = preparedContractResponse[information];
        if (!currentContract
            || !ResponseContract.contractKind.has(currentContract)) {
            throw new ResponseContract.Error(information, "Contract not found.");
        }
        const result = currentContract.body.parse(body);
        if (E.isLeft(result)) {
            throw new ResponseContract.Error(information, unwrap(result));
        }
        return new PredictedResponse(currentContract.code, information, body);
    };
    const serverSentEventsResponse = (information, startSendingEvents) => {
        const currentContract = preparedContractResponse[information];
        if (!currentContract
            || !ResponseContract.serverSentEventsContractKind.has(currentContract)) {
            throw new ResponseContract.Error(information, "Contract not found.");
        }
        return new ServerSentEventsPredictedResponse(currentContract.code, information, (params) => startSendingEvents({
            ...params,
            send: (event, data, sendParams) => {
                const dataParser = currentContract.events[event];
                if (!dataParser) {
                    console.error(new ResponseContract.Error(information, `Event '${event}' not found.`));
                    return Promise.resolve();
                }
                const result = dataParser.parse(data);
                if (E.isLeft(result)) {
                    console.error(new ResponseContract.Error(information, unwrap(result)));
                    return Promise.resolve();
                }
                return params.send(event, data, sendParams);
            },
        }));
    };
    const streamResponse = (information, startStream) => {
        const currentContract = preparedContractResponse[information];
        if (!currentContract
            || !ResponseContract.streamContractKind.has(currentContract)) {
            throw new ResponseContract.Error(information, "Contract not found.");
        }
        return new StreamPredictedResponse(currentContract.code, information, (params) => startStream({
            ...params,
            send: (...args) => {
                for (let index = 0; index < args.length; index++) {
                    const result = currentContract.flux.parse(args[index]);
                    if (E.isLeft(result)) {
                        console.error(new ResponseContract.Error(information, unwrap(result)));
                        return Promise.resolve();
                    }
                }
                return params.send(...args);
            },
        }));
    };
    const streamTextResponse = (information, startStreamText) => {
        const currentContract = preparedContractResponse[information];
        if (!currentContract
            || !ResponseContract.streamTextContractKind.has(currentContract)) {
            throw new ResponseContract.Error(information, "Contract not found.");
        }
        return new StreamTextPredictedResponse(currentContract.code, information, startStreamText);
    };
    return success({
        buildedFunction: async (request, floor) => handlerFunction(floor, {
            request,
            response,
            serverSentEventsResponse,
            streamResponse,
            streamTextResponse,
        }),
        hooksRouteLifeCycle: [],
    });
});

export { defaultHandlerStepFunctionBuilder };
