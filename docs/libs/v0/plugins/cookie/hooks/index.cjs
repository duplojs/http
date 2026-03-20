'use strict';

var parseRequestCookie = require('./parseRequestCookie.cjs');
var serializeResponseCookie = require('./serializeResponseCookie.cjs');



exports.parseRequestCookieHook = parseRequestCookie.parseRequestCookieHook;
exports.serializeResponseCookieHook = serializeResponseCookie.serializeResponseCookieHook;
