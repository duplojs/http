import { createCoreLibKind } from '../kind.mjs';

const hookRouteExitKind = createCoreLibKind("route-hook-exit");
const hookRouteNextKind = createCoreLibKind("route-hook-next");
function createHookRouteLifeCycle(...args) {
    if (args.length === 1) {
        return args[0];
    }
    return {
        ...args[1],
        onConstructRequest: args[0],
    };
}

export { createHookRouteLifeCycle, hookRouteExitKind, hookRouteNextKind };
