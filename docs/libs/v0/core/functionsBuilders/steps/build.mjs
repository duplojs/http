import { E, G, unwrap } from '@duplojs/utils';

function buildStepFunction(step, params) {
    const functionParams = {
        success(value) {
            return E.right("buildSuccess", value);
        },
        buildStep(step) {
            return buildStepFunction(step, params);
        },
        environment: params.environment,
        defaultExtractContract: params.defaultExtractContract,
    };
    return G.asyncReduce(params.stepFunctionBuilders, G.reduceFrom(E.left("stepNotSupport", step)), async ({ element: functionBuilder, lastValue, next, exit, }) => {
        const result = await functionBuilder(step, functionParams);
        if (E.isLeft(result)) {
            if (unwrap(result) !== step) {
                return exit(result);
            }
            return next(lastValue);
        }
        return exit(result);
    });
}

export { buildStepFunction };
