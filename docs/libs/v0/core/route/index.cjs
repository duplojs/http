'use strict';

var utils = require('@duplojs/utils');
var kind = require('../kind.cjs');
require('./types/index.cjs');
var hooks = require('./hooks.cjs');

const routeKind = kind.createCoreLibKind("route");
function createRoute(definition) {
    return utils.pipe({ definition }, routeKind.setTo);
}

exports.createHookRouteLifeCycle = hooks.createHookRouteLifeCycle;
exports.hookRouteExitKind = hooks.hookRouteExitKind;
exports.hookRouteNextKind = hooks.hookRouteNextKind;
exports.createRoute = createRoute;
exports.routeKind = routeKind;
