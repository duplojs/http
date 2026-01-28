import '../../../steps/index.mjs';
import { createStepFunctionBuilder } from '../create.mjs';
import { wrapValue, A, E, unwrap } from '@duplojs/utils';
import '../../../response/index.mjs';
import { cutStepKind, cutStepOutputKind } from '../../../steps/cut.mjs';
import { ResponseContract } from '../../../response/contract.mjs';
import { PredictedResponse } from '../../../response/predicted.mjs';

const defaultCutStepFunctionBuilder = createStepFunctionBuilder(cutStepKind.has, (step, { success }) => {
    const { responseContract, theFunction: cutFunction, } = step.definition;
    const output = (data) => cutStepOutputKind.setTo(wrapValue(data ?? {}));
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
    function treatResult(result, floor) {
        if (cutStepOutputKind.has(result)) {
            return {
                ...floor,
                ...unwrap(result),
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

export { defaultCutStepFunctionBuilder };
