import '../../../steps/index.mjs';
import { createStepFunctionBuilder } from '../create.mjs';
import { A, E, unwrap } from '@duplojs/utils';
import '../../../response/index.mjs';
import { handlerStepKind } from '../../../steps/handler.mjs';
import { ResponseContract } from '../../../response/contract.mjs';
import { PredictedResponse } from '../../../response/predicted.mjs';

const defaultHandlerStepFunctionBuilder = createStepFunctionBuilder(handlerStepKind.has, (step, { success }) => {
    const { responseContract, theFunction: handlerFunction, } = step.definition;
    const preparedContractResponse = A.reduce(A.coalescing(responseContract), A.reduceFrom({}), ({ element, lastValue, nextWithObject }) => nextWithObject(lastValue, {
        [element.information]: element,
    }));
    const response = (information, body) => {
        const currentContract = preparedContractResponse[information];
        if (!currentContract) {
            throw new ResponseContract.Error(information);
        }
        const result = currentContract.body.parse(body);
        if (E.isLeft(result)) {
            throw new ResponseContract.Error(information, unwrap(result));
        }
        return new PredictedResponse(currentContract.code, currentContract.information, body);
    };
    return success({
        buildedFunction: (request, floor) => handlerFunction(floor, {
            request,
            response,
        }),
        hooksRouteLifeCycle: [],
    });
});

export { defaultHandlerStepFunctionBuilder };
