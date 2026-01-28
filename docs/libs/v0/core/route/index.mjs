import { pipe } from '@duplojs/utils';
import { createCoreLibKind } from '../kind.mjs';
import './types/index.mjs';
export { createHookRouteLifeCycle, hookRouteExitKind, hookRouteNextKind } from './hooks.mjs';

const routeKind = createCoreLibKind("route");
function createRoute(definition) {
    return pipe({ definition }, routeKind.setTo);
}

export { createRoute, routeKind };
