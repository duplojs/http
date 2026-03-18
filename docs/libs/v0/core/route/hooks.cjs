'use strict';

var kind = require('../kind.cjs');

const hookRouteExitKind = kind.createCoreLibKind("route-hook-exit");
const hookRouteNextKind = kind.createCoreLibKind("route-hook-next");
function createHookRouteLifeCycle(hookRouteLifeCycle) {
    return hookRouteLifeCycle;
}

exports.createHookRouteLifeCycle = createHookRouteLifeCycle;
exports.hookRouteExitKind = hookRouteExitKind;
exports.hookRouteNextKind = hookRouteNextKind;
