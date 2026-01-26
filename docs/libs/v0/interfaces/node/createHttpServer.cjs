'use strict';

var utils = require('@duplojs/utils');
var http = require('http');
var https = require('https');
var hooks = require('./hooks.cjs');
var implementHttpServer = require('../../core/implementHttpServer.cjs');

function createHttpServer(inputHub, params) {
    const httpServerParams = utils.O.override({
        host: "localhost",
        port: 80,
        maxBodySize: "50mb",
        informationHeaderKey: "information",
        predictedHeaderKey: "predicted",
        fromHookHeaderKey: "from-hook",
        interface: "node",
    }, params);
    const hooks$1 = hooks.makeNodeHook(inputHub, httpServerParams);
    const hub = inputHub.addRouteHooks(hooks$1);
    function whenUncaughtError(error, routerInitializationData) {
        const serverResponse = routerInitializationData.raw.response;
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
    }
    return implementHttpServer.implementHttpServer({
        hub,
        httpServerParams,
    }, ({ httpServerParams, execRouteSystem }) => {
        const server = httpServerParams.https
            ? https.createServer(httpServerParams.https)
            : http.createServer(httpServerParams.http ?? {});
        server.addListener("request", (serverRequest, serverResponse) => execRouteSystem({
            method: serverRequest.method ?? "",
            headers: serverRequest.headers,
            host: serverRequest.headers.host ?? "",
            origin: serverRequest.headers.origin ?? "",
            url: serverRequest.url ?? "",
            raw: {
                request: serverRequest,
                response: serverResponse,
            },
        }, whenUncaughtError));
        return new Promise((resolve) => {
            server.listen({
                port: httpServerParams.port,
                host: httpServerParams.host,
            }, () => void resolve(server));
        });
    });
}

exports.createHttpServer = createHttpServer;
