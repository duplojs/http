'use strict';

var parser = require('./parser.cjs');
var serialize = require('./serialize.cjs');
require('./hooks/index.cjs');
var parseRequestCookie = require('./hooks/parseRequestCookie.cjs');
var serializeResponseCookie = require('./hooks/serializeResponseCookie.cjs');

function cookiePlugin(params) {
    return () => ({
        name: "cookie-plugin",
        hooksRouteLifeCycle: [
            parseRequestCookie.parseRequestCookieHook({ parser: params?.parser ?? parser.defaultParser }),
            serializeResponseCookie.serializeResponseCookieHook({ serializer: params?.serializer ?? serialize.defaultSerializer }),
        ],
    });
}

exports.cookiePlugin = cookiePlugin;
