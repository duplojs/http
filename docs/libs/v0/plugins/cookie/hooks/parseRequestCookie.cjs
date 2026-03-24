'use strict';

require('../../../core/route/index.cjs');
var hooks = require('../../../core/route/hooks.cjs');

function parseRequestCookieHook(params) {
    return hooks.createHookRouteLifeCycle({
        beforeRouteExecution: ({ request, next }) => {
            if (request.headers.cookie) {
                const cookieValue = Array.isArray(request.headers.cookie)
                    ? request.headers.cookie.join("; ")
                    : request.headers.cookie;
                request.cookies = params.parser(cookieValue);
            }
            return next();
        },
    });
}

exports.parseRequestCookieHook = parseRequestCookieHook;
