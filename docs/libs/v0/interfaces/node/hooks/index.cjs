'use strict';

require('../../../core/response/index.cjs');
require('../../../core/route/index.cjs');
var serverSentEvents = require('../../../core/serverSentEvents.cjs');
var serverUtils = require('@duplojs/server-utils');
var utils = require('@duplojs/utils');
var node_fs = require('node:fs');
var hooks = require('../../../core/route/hooks.cjs');
var serverSentEventsPredicted = require('../../../core/response/serverSentEventsPredicted.cjs');

function initNodeHook(hub, serverParams) {
    const isDev = hub.config.environment === "DEV";
    return hooks.createHookRouteLifeCycle({
        beforeSendResponse({ request, currentResponse, exit }) {
            request.raw.response.writeHead(Number(currentResponse.code), currentResponse.headers);
            return exit();
        },
        async sendResponse({ request, currentResponse, exit }) {
            const { response: rawResponse, request: rawRequest } = request.raw;
            if (currentResponse instanceof serverSentEventsPredicted.ServerSentEventsPredictedResponse) {
                const handler = serverSentEvents.ServerSentEvents.init(currentResponse, {
                    lastId: typeof request.headers["last-event-id"] === "string"
                        ? request.headers["last-event-id"]
                        : null,
                });
                rawRequest.on("close", handler.abort);
                void handler.start((value) => new Promise((resolve) => {
                    if (!rawResponse.write(value)) {
                        rawResponse.once("drain", resolve);
                    }
                    else {
                        resolve();
                    }
                }), () => void rawResponse.end());
                return exit();
            }
            const body = currentResponse.body;
            if (body instanceof Error) {
                rawResponse.write(body.toString());
            }
            else if (serverUtils.SF.isFileInterface(body)) {
                await new Promise((resolve, reject) => {
                    node_fs.createReadStream(body.path)
                        .pipe(request.raw.response
                        .once("error", reject)
                        .once("close", resolve));
                });
            }
            else if (typeof body === "object"
                || typeof body === "number"
                || typeof body === "boolean") {
                rawResponse.write(JSON.stringify(body));
            }
            else if (typeof body === "string") {
                rawResponse.write(body);
            }
            rawResponse.end();
            return exit();
        },
        async afterSendResponse({ request, next }) {
            if (request.filesAttache) {
                await Promise.all(utils.A.map(request.filesAttache, (path) => serverUtils.SF.remove(path)));
            }
            return next();
        },
    });
}

exports.initNodeHook = initNodeHook;
