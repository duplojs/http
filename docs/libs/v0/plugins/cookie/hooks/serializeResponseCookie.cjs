'use strict';

require('../../../core/route/index.cjs');
var hooks = require('../../../core/route/hooks.cjs');

function serializeResponseCookieHook(params) {
    return hooks.createHookRouteLifeCycle({
        beforeSendResponse: ({ currentResponse, next }) => {
            if (currentResponse.cookie !== undefined && Object.keys(currentResponse.cookie).length !== 0) {
                currentResponse.setHeader("set-cookie", Object.entries(currentResponse.cookie).map(([name, content]) => params.serializer(name, content.value, content.params)));
            }
            return next();
        },
    });
}

exports.serializeResponseCookieHook = serializeResponseCookieHook;
