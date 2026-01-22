import '../../core/hub/index.mjs';
import { buildRouter } from '../../core/router/index.mjs';
import { forward } from '@duplojs/utils';
import http from 'http';
import https from 'https';
import { makeNodeHook } from './hooks.mjs';
import { launchHookServer, launchHookServerError, serverErrorNextHookFunction, serverErrorExitHookFunction } from '../../core/hub/hooks.mjs';

async function createHttpServer(inputHub, params) {
    const httpServerParams = {
        ...params,
        maxBodySize: "50mb",
        informationHeaderKey: "information",
        predictedHeaderKey: "predicted",
        fromHookHeaderKey: "from-hook",
        interface: "node",
    };
    const newHub1 = await launchHookServer(inputHub.aggregatesHooksHubLifeCycle("beforeServerBuildRoutes"), inputHub, httpServerParams);
    const router = await buildRouter(newHub1.addRouteHooks(makeNodeHook(newHub1, httpServerParams)));
    const newHub2 = await launchHookServer(newHub1.aggregatesHooksHubLifeCycle("beforeStartServer"), newHub1, httpServerParams);
    if (inputHub.config.environment === "BUILD") {
        process.exit(0);
    }
    const server = params.https
        ? https.createServer(params.https)
        : http.createServer(params.http ?? {});
    const serverErrorHooks = newHub1.aggregatesHooksHubLifeCycle("serverError");
    server.addListener("request", (serverRequest, serverResponse) => router
        .exec({
        method: serverRequest.method ?? "",
        headers: serverRequest.headers,
        host: serverRequest.headers.host ?? "",
        origin: serverRequest.headers.origin ?? "",
        url: serverRequest.url ?? "",
        raw: {
            request: serverRequest,
            response: serverResponse,
        },
    })
        .catch(async (error) => {
        await launchHookServerError(serverErrorHooks, {
            error,
            exit: serverErrorExitHookFunction,
            next: serverErrorNextHookFunction,
            serverRequest,
            serverResponse,
        }).catch(forward);
        if (!serverResponse.headersSent && !serverResponse.writableEnded) {
            serverResponse.writeHead(500, {
                [httpServerParams.informationHeaderKey]: "critical-server-error",
            });
            const maybeError = error?.toString?.();
            serverResponse.write(typeof maybeError === "string"
                ? maybeError
                : "unknown-server-error");
        }
        if (!serverResponse.writableEnded) {
            serverResponse.end();
        }
    }));
    await new Promise((resolve) => {
        server.listen({
            port: httpServerParams.port,
            host: httpServerParams.host,
        }, () => void resolve());
    });
    await launchHookServer(newHub2.aggregatesHooksHubLifeCycle("afterStartServer"), newHub2, httpServerParams);
    return server;
}

export { createHttpServer };
