'use strict';

var utils = require('@duplojs/utils');

function buildStepFunction(step, params) {
    const functionParams = {
        success(value) {
            return utils.E.right("buildSuccess", value);
        },
        buildStep(step) {
            return buildStepFunction(step, params);
        },
        environment: params.environment,
        defaultExtractContract: params.defaultExtractContract,
    };
    return utils.G.asyncReduce(params.stepFunctionBuilders, utils.G.reduceFrom(utils.E.left("stepNotSupport", step)), async ({ element: functionBuilder, lastValue, next, exit, }) => {
        const result = await functionBuilder(step, functionParams);
        if (utils.E.isLeft(result)) {
            if (utils.unwrap(result) !== step) {
                return exit(result);
            }
            return next(lastValue);
        }
        return exit(result);
    });
}

exports.buildStepFunction = buildStepFunction;
