import { defaultParser } from './parser.mjs';
import { defaultSerializer } from './serialize.mjs';
import './hooks/index.mjs';
import { parseRequestCookieHook } from './hooks/parseRequestCookie.mjs';
import { serializeResponseCookieHook } from './hooks/serializeResponseCookie.mjs';

function cookiePlugin(params) {
    return () => ({
        name: "cookie-plugin",
        hooksRouteLifeCycle: [
            parseRequestCookieHook({ parser: params?.parser ?? defaultParser }),
            serializeResponseCookieHook({ serializer: params?.serializer ?? defaultSerializer }),
        ],
    });
}

export { cookiePlugin };
