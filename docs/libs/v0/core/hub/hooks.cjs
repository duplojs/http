'use strict';

var utils = require('@duplojs/utils');
var kind = require('../kind.cjs');

const hookServerExitKind = kind.createCoreLibKind("server-hook-exit");
const hookServerNextKind = kind.createCoreLibKind("server-hook-next");
async function launchHookBeforeBuildRoute(hooks, route) {
    return utils.G.asyncReduce(hooks, utils.G.reduceFrom(route), async ({ element: hook, lastValue, next, }) => next(await hook(lastValue)));
}
async function launchHookServer(hooks, hub, httpServerParams) {
    return utils.G.asyncReduce(hooks, utils.G.reduceFrom(hub), async ({ element: hook, lastValue, next, }) => next((await hook(lastValue, httpServerParams)) ?? lastValue));
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
function createHookHubLifeCycle(hookHubLifeCycle) {
    return hookHubLifeCycle;
}

exports.createHookHubLifeCycle = createHookHubLifeCycle;
exports.hookServerExitKind = hookServerExitKind;
exports.hookServerNextKind = hookServerNextKind;
exports.launchHookBeforeBuildRoute = launchHookBeforeBuildRoute;
exports.launchHookServer = launchHookServer;
exports.launchHookServerError = launchHookServerError;
exports.serverErrorExitHookFunction = serverErrorExitHookFunction;
exports.serverErrorNextHookFunction = serverErrorNextHookFunction;
