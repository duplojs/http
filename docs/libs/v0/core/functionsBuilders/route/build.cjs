'use strict';

var utils = require('@duplojs/utils');
require('../steps/index.cjs');
var build = require('../steps/build.cjs');

function buildRouteFunction(route, params) {
    const functionParams = {
        success(value) {
            return utils.E.right("buildSuccess", value);
        },
        buildStep(step) {
            return build.buildStepFunction(step, params);
        },
        environment: params.environment,
        globalHooksRouteLifeCycle: params.globalHooksRouteLifeCycle,
        defaultExtractContract: params.defaultExtractContract,
    };
    return utils.G.asyncReduce(params.routeFunctionBuilders, utils.G.reduceFrom(utils.E.left("routeNotSupport", route)), async ({ element: functionBuilder, lastValue, next, exit, }) => {
        const result = await functionBuilder(route, functionParams);
        if (utils.E.isLeft(result)) {
            if (utils.unwrap(result) !== route) {
                return exit(result);
            }
            return next(lastValue);
        }
        return exit(result);
    });
}

exports.buildRouteFunction = buildRouteFunction;
