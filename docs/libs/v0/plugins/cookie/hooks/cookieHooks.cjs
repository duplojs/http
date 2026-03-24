'use strict';

var parser = require('../parser.cjs');
var serialize = require('../serialize.cjs');
var parseRequestCookie = require('./parseRequestCookie.cjs');
var serializeResponseCookie = require('./serializeResponseCookie.cjs');

function cookieHooks({ parser: parser$1 = parser.defaultParser, serializer = serialize.defaultSerializer, } = {}) {
    return {
        ...parseRequestCookie.parseRequestCookieHook({ parser: parser$1 }),
        ...serializeResponseCookie.serializeResponseCookieHook({ serializer }),
    };
}

exports.cookieHooks = cookieHooks;
