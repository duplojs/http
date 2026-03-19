import { createCacheControlResponseHeader } from './createResponseHeader.mjs';
import '../../core/route/index.mjs';
import { createHookRouteLifeCycle } from '../../core/route/hooks.mjs';

const eligibleCodeRegex = /^(?:2|3)/;
function createCacheControllerHooks(params) {
    const cacheControl = params
        ? createCacheControlResponseHeader(params)
        : null;
    return createHookRouteLifeCycle({
        beforeSendResponse: ({ currentResponse, next }) => {
            if (cacheControl
                && eligibleCodeRegex.test(currentResponse.code)
                && currentResponse.headers?.["cache-control"] === undefined) {
                currentResponse.setHeader("cache-control", cacheControl);
            }
            return next();
        },
    });
}

export { createCacheControllerHooks };
