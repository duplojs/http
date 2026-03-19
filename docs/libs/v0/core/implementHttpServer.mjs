import './hub/index.mjs';
import { createRouter } from './router/index.mjs';
import { forward } from '@duplojs/utils';
import { initDefaultHook } from './defaultHooks/index.mjs';
import { launchHookServer, launchHookServerError, serverErrorNextHookFunction, serverErrorExitHookFunction } from './hub/hooks.mjs';

async function implementHttpServer(params, initHttpServer) {
    await launchHookServer(params.hub.aggregatesHooksHubLifeCycle("beforeServerBuildRoutes"), params.hub, params.httpServerParams);
    params.hub.addRouteHooks([
        initDefaultHook(params.hub, params.httpServerParams),
        ...params.getInterfaceHooks(params),
    ]);
    const router = await createRouter(params.hub);
    await launchHookServer(params.hub.aggregatesHooksHubLifeCycle("beforeStartServer"), params.hub, params.httpServerParams);
    const serverErrorHooks = params.hub.aggregatesHooksHubLifeCycle("serverError");
    function catchCriticalError(error) {
        console.error("Critical Error :", error);
    }
    const execRouteSystem = (routerInitializationData, whenUncaughtError) => router
        .exec(routerInitializationData)
        .catch(async (error) => {
        await launchHookServerError(serverErrorHooks, {
            error,
            exit: serverErrorExitHookFunction,
            next: serverErrorNextHookFunction,
            routerInitializationData: routerInitializationData,
        }).catch(forward);
        await whenUncaughtError(error, routerInitializationData);
    })
        .catch(catchCriticalError);
    const result = await initHttpServer({
        execRouteSystem: execRouteSystem,
        httpServerParams: params.httpServerParams,
    });
    await launchHookServer(params.hub.aggregatesHooksHubLifeCycle("afterStartServer"), params.hub, params.httpServerParams);
    return result;
}

export { implementHttpServer };
