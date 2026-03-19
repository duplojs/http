'use strict';

var createResponseHeader = require('./createResponseHeader.cjs');
require('../../core/route/index.cjs');
var hooks = require('../../core/route/hooks.cjs');

const eligibleCodeRegex = /^(?:2|3)/;
function createCacheControllerHooks(params) {
    const cacheControl = params
        ? createResponseHeader.createCacheControlResponseHeader(params)
        : null;
    return hooks.createHookRouteLifeCycle({
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

exports.createCacheControllerHooks = createCacheControllerHooks;
