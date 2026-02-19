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
        return new PredictedResponse(currentContract.code, currentContract.information, body);
    };
    return success({
        buildedFunction: async (request, floor) => {
            const cutResult = await cutFunction(floor, {
                request,
                output,
                response,
            });
            if (cutResult instanceof PredictedResponse) {
                const currentContract = preparedContractResponse[cutResult.information];
                const resultBody = currentContract.body.isAsynchronous()
                    ? await currentContract.body.asyncParse(cutResult.body)
                    : currentContract.body.parse(cutResult.body);
                if (E.isLeft(resultBody)) {
                    throw new ResponseContract.Error(cutResult.information, unwrap(resultBody));
                }
                return cutResult;
            }
            return {
                ...floor,
                ...unwrap(cutResult),
            };
        },
        hooksRouteLifeCycle: [],
    });
});

export { defaultCutStepFunctionBuilder };
