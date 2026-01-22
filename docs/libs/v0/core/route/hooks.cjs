'use strict';

var kind = require('../kind.cjs');
require('../response/index.cjs');

const hookRouteExitKind = kind.createCoreLibKind("route-hook-exit");
const hookRouteNextKind = kind.createCoreLibKind("route-hook-next");
function createHookRouteLifeCycle(...args) {
    if (args.length === 1) {
        return args[0];
    }
    return {
        ...args[1],
        onConstructRequest: args[0],
    };
}

exports.createHookRouteLifeCycle = createHookRouteLifeCycle;
exports.hookRouteExitKind = hookRouteExitKind;
exports.hookRouteNextKind = hookRouteNextKind;
