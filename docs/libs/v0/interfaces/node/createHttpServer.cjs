'use strict';

var http = require('http');
var https = require('https');
var index$3 = require('./hooks/index.cjs');
var implementHttpServer = require('../../core/implementHttpServer.cjs');
var utils = require('@duplojs/utils');
var index$2 = require('../../core/defaultHooks/index.cjs');
require('./bodyReaders/index.cjs');
var index = require('./bodyReaders/text/index.cjs');
var index$1 = require('./bodyReaders/formData/index.cjs');

function createHttpServer(hub, params) {
    const httpServerParams = utils.O.override({
        host: "localhost",
        port: 80,
        maxBodySize: "50mb",
        informationHeaderKey: "information",
        predictedHeaderKey: "predicted",
        fromHookHeaderKey: "from-hook",
        interface: "node",
        uploadFolder: "./upload",
    }, params);
    hub.addBodyReaderImplementation([
        index.createTextBodyReaderImplementation(httpServerParams),
        index$1.createFormDataBodyReaderImplementation(httpServerParams),
    ]);
    hub.addRouteHooks([
        index$2.initDefaultHook(hub, httpServerParams),
        index$3.initNodeHook(hub, httpServerParams),
    ]);
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
        if (hub.config.environment === "BUILD") {
            return server;
        }
        return new Promise((resolve) => {
            server.listen({
                port: httpServerParams.port,
                host: httpServerParams.host,
            }, () => void resolve(server));
        });
    });
}

exports.createHttpServer = createHttpServer;
