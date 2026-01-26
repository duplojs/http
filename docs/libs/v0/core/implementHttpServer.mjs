import './hub/index.mjs';
import { buildRouter } from './router/index.mjs';
import { forward } from '@duplojs/utils';
import { launchHookServer, launchHookServerError, serverErrorNextHookFunction, serverErrorExitHookFunction } from './hub/hooks.mjs';

async function implementHttpServer(params, initHttpServer) {
    const newHub1 = await launchHookServer(params.hub.aggregatesHooksHubLifeCycle("beforeServerBuildRoutes"), params.hub, params.httpServerParams);
    const router = await buildRouter(newHub1);
    const newHub2 = await launchHookServer(newHub1.aggregatesHooksHubLifeCycle("beforeStartServer"), newHub1, params.httpServerParams);
    const serverErrorHooks = newHub1.aggregatesHooksHubLifeCycle("serverError");
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
    await launchHookServer(newHub2.aggregatesHooksHubLifeCycle("afterStartServer"), newHub2, params.httpServerParams);
    return result;
}

export { implementHttpServer };
