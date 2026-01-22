'use strict';

require('../../core/hub/index.cjs');
var index = require('../../core/router/index.cjs');
var utils = require('@duplojs/utils');
var http = require('http');
var https = require('https');
var hooks$1 = require('./hooks.cjs');
var hooks = require('../../core/hub/hooks.cjs');

async function createHttpServer(inputHub, params) {
    const httpServerParams = {
        ...params,
        maxBodySize: "50mb",
        informationHeaderKey: "information",
        predictedHeaderKey: "predicted",
        fromHookHeaderKey: "from-hook",
        interface: "node",
    };
    const newHub1 = await hooks.launchHookServer(inputHub.aggregatesHooksHubLifeCycle("beforeServerBuildRoutes"), inputHub, httpServerParams);
    const router = await index.buildRouter(newHub1.addRouteHooks(hooks$1.makeNodeHook(newHub1, httpServerParams)));
    const newHub2 = await hooks.launchHookServer(newHub1.aggregatesHooksHubLifeCycle("beforeStartServer"), newHub1, httpServerParams);
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
        await hooks.launchHookServerError(serverErrorHooks, {
            error,
            exit: hooks.serverErrorExitHookFunction,
            next: hooks.serverErrorNextHookFunction,
            serverRequest,
            serverResponse,
        }).catch(utils.forward);
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
    await hooks.launchHookServer(newHub2.aggregatesHooksHubLifeCycle("afterStartServer"), newHub2, httpServerParams);
    return server;
}

exports.createHttpServer = createHttpServer;
