import '../../../core/route/index.mjs';
import { createHookRouteLifeCycle } from '../../../core/route/hooks.mjs';

function serializeResponseCookieHook(params) {
    return createHookRouteLifeCycle({
        beforeSendResponse: ({ currentResponse, next }) => {
            if (currentResponse.cookie !== undefined && Object.keys(currentResponse.cookie).length !== 0) {
                currentResponse.setHeader("set-cookie", Object.entries(currentResponse.cookie).map(([name, content]) => params.serializer(name, content.value, content.params)));
            }
            return next();
        },
    });
}

export { serializeResponseCookieHook };
