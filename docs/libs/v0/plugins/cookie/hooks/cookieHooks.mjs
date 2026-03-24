import { defaultParser } from '../parser.mjs';
import { defaultSerializer } from '../serialize.mjs';
import { parseRequestCookieHook } from './parseRequestCookie.mjs';
import { serializeResponseCookieHook } from './serializeResponseCookie.mjs';

function cookieHooks({ parser = defaultParser, serializer = defaultSerializer, } = {}) {
    return {
        ...parseRequestCookieHook({ parser }),
        ...serializeResponseCookieHook({ serializer }),
    };
}

export { cookieHooks };
