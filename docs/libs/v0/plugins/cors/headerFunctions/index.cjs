'use strict';

var allowHeaders = require('./allowHeaders.cjs');
var allowMethods = require('./allowMethods.cjs');
var allowOrigin = require('./allowOrigin.cjs');
var credentials = require('./credentials.cjs');
var exposeHeaders = require('./exposeHeaders.cjs');
var maxAge = require('./maxAge.cjs');
var vary = require('./vary.cjs');



exports.allowHeadersFunction = allowHeaders.allowHeadersFunction;
exports.allowMethodsFunction = allowMethods.allowMethodsFunction;
exports.allowOriginFunction = allowOrigin.allowOriginFunction;
exports.credentialsFunction = credentials.credentialsFunction;
exports.exposeHeadersFunction = exposeHeaders.exposeHeadersFunction;
exports.maxAgeFunction = maxAge.maxAgeFunction;
exports.varyFunction = vary.varyFunction;
