import { G } from '@duplojs/utils';
import { createCoreLibKind } from '../kind.mjs';

const hookServerExitKind = createCoreLibKind("server-hook-exit");
const hookServerNextKind = createCoreLibKind("server-hook-next");
async function launchHookBeforeBuildRoute(hooks, route) {
    return G.asyncReduce(hooks, G.reduceFrom(route), async ({ element: hook, lastValue, next, }) => next(await hook(lastValue)));
}
async function launchHookServer(hooks, hub, httpServerParams) {
    return G.asyncReduce(hooks, G.reduceFrom(hub), async ({ element: hook, lastValue, next, }) => next((await hook(lastValue, httpServerParams)) ?? lastValue));
}
const hookExit = hookServerExitKind.setTo({});
const hookNext = hookServerNextKind.setTo({});
function serverErrorExitHookFunction() {
    return hookExit;
}
function serverErrorNextHookFunction() {
    return hookNext;
}
async function launchHookServerError(hooks, params) {
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let index = 0; index < hooks.length; index++) {
        const result = await hooks[index](params);
        if (hookServerExitKind.has(result)) {
            return;
        }
    }
}

export { hookServerExitKind, hookServerNextKind, launchHookBeforeBuildRoute, launchHookServer, launchHookServerError, serverErrorExitHookFunction, serverErrorNextHookFunction };
