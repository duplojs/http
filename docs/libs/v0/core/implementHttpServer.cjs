'use strict';

require('./hub/index.cjs');
var index$1 = require('./router/index.cjs');
var utils = require('@duplojs/utils');
var index = require('./defaultHooks/index.cjs');
var hooks = require('./hub/hooks.cjs');

async function implementHttpServer(params, initHttpServer) {
    await hooks.launchHookServer(params.hub.aggregatesHooksHubLifeCycle("beforeServerBuildRoutes"), params.hub, params.httpServerParams);
    params.hub.addRouteHooks([
        index.initDefaultHook(params.hub, params.httpServerParams),
        ...params.getInterfaceHooks(params),
    ]);
    const router = await index$1.createRouter(params.hub);
    await hooks.launchHookServer(params.hub.aggregatesHooksHubLifeCycle("beforeStartServer"), params.hub, params.httpServerParams);
    const serverErrorHooks = params.hub.aggregatesHooksHubLifeCycle("serverError");
    function catchCriticalError(error) {
        console.error("Critical Error :", error);
    }
    const execRouteSystem = (routerInitializationData, whenUncaughtError) => router
        .exec(routerInitializationData)
        .catch(async (error) => {
        await hooks.launchHookServerError(serverErrorHooks, {
            error,
            exit: hooks.serverErrorExitHookFunction,
            next: hooks.serverErrorNextHookFunction,
            routerInitializationData: routerInitializationData,
        }).catch(utils.forward);
        await whenUncaughtError(error, routerInitializationData);
    })
        .catch(catchCriticalError);
    const result = await initHttpServer({
        execRouteSystem: execRouteSystem,
        httpServerParams: params.httpServerParams,
    });
    await hooks.launchHookServer(params.hub.aggregatesHooksHubLifeCycle("afterStartServer"), params.hub, params.httpServerParams);
    return result;
}

exports.implementHttpServer = implementHttpServer;
