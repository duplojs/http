'use strict';

require('./hub/index.cjs');
var index = require('./router/index.cjs');
var utils = require('@duplojs/utils');
var hooks = require('./hub/hooks.cjs');

async function implementHttpServer(params, initHttpServer) {
    const newHub1 = await hooks.launchHookServer(params.hub.aggregatesHooksHubLifeCycle("beforeServerBuildRoutes"), params.hub, params.httpServerParams);
    const router = await index.buildRouter(newHub1);
    const newHub2 = await hooks.launchHookServer(newHub1.aggregatesHooksHubLifeCycle("beforeStartServer"), newHub1, params.httpServerParams);
    const serverErrorHooks = newHub1.aggregatesHooksHubLifeCycle("serverError");
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
    await hooks.launchHookServer(newHub2.aggregatesHooksHubLifeCycle("afterStartServer"), newHub2, params.httpServerParams);
    return result;
}

exports.implementHttpServer = implementHttpServer;
