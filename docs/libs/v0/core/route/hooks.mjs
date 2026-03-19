import { createCoreLibKind } from '../kind.mjs';

const hookRouteExitKind = createCoreLibKind("route-hook-exit");
const hookRouteNextKind = createCoreLibKind("route-hook-next");
function createHookRouteLifeCycle(hookRouteLifeCycle) {
    return hookRouteLifeCycle;
}

export { createHookRouteLifeCycle, hookRouteExitKind, hookRouteNextKind };
