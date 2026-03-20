import '../../../core/route/index.mjs';
import { createHookRouteLifeCycle } from '../../../core/route/hooks.mjs';

function parseRequestCookieHook(params) {
    return createHookRouteLifeCycle({
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

export { parseRequestCookieHook };
