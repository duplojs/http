'use strict';

var parser = require('./parser.cjs');
var serialize = require('./serialize.cjs');
require('./override.cjs');
var metadata = require('./metadata.cjs');
require('./hooks/index.cjs');
var plugin = require('./plugin.cjs');
var parseRequestCookie = require('./hooks/parseRequestCookie.cjs');
var serializeResponseCookie = require('./hooks/serializeResponseCookie.cjs');
var cookieHooks = require('./hooks/cookieHooks.cjs');



exports.decode = parser.decode;
exports.defaultParser = parser.defaultParser;
exports.findPairEndIndex = parser.findPairEndIndex;
exports.sliceAndTrimOws = parser.sliceAndTrimOws;
exports.SerializeCookieError = serialize.SerializeCookieError;
exports.defaultSerializer = serialize.defaultSerializer;
exports.IgnoreRouteCookieMetadata = metadata.IgnoreRouteCookieMetadata;
exports.cookiePlugin = plugin.cookiePlugin;
exports.parseRequestCookieHook = parseRequestCookie.parseRequestCookieHook;
exports.serializeResponseCookieHook = serializeResponseCookie.serializeResponseCookieHook;
exports.cookieHooks = cookieHooks.cookieHooks;
