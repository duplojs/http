'use strict';

var hooks = require('./hooks.cjs');
require('./types/index.cjs');
var createResponseHeader = require('./createResponseHeader.cjs');



exports.createCacheControllerHooks = hooks.createCacheControllerHooks;
exports.createCacheControlResponseHeader = createResponseHeader.createCacheControlResponseHeader;
