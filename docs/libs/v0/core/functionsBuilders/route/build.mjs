import { E, G, unwrap } from '@duplojs/utils';
import '../steps/index.mjs';
import { buildStepFunction } from '../steps/build.mjs';

function buildRouteFunction(route, params) {
    const functionParams = {
        success(value) {
            return E.right("buildSuccess", value);
        },
        buildStep(step) {
            return buildStepFunction(step, params);
        },
        environment: params.environment,
        globalHooksRouteLifeCycle: params.globalHooksRouteLifeCycle,
        defaultExtractContract: params.defaultExtractContract,
    };
    return G.asyncReduce(params.routeFunctionBuilders, G.reduceFrom(E.left("routeNotSupport", route)), async ({ element: functionBuilder, lastValue, next, exit, }) => {
        const result = await functionBuilder(route, functionParams);
        if (E.isLeft(result)) {
            if (unwrap(result) !== route) {
                return exit(result);
            }
            return next(lastValue);
        }
        return exit(result);
    });
}

export { buildRouteFunction };
