'use strict';

require('../response/index.cjs');
require('../route/index.cjs');
var serverUtils = require('@duplojs/server-utils');
var hooks = require('../route/hooks.cjs');
var predicted = require('../response/predicted.cjs');
var serverSentEventsPredicted = require('../response/serverSentEventsPredicted.cjs');
var hook = require('../response/hook.cjs');

function initDefaultHook(hub, serverParams) {
    const informationHeaderKey = serverParams.informationHeaderKey;
    const predictedHeaderKey = serverParams.predictedHeaderKey;
    const fromHookHeaderKey = serverParams.fromHookHeaderKey;
    const isDev = hub.config.environment === "DEV";
    return hooks.createHookRouteLifeCycle({
        beforeSendResponse({ currentResponse, next }) {
            if (!currentResponse.headers?.["content-type"]) {
                const body = currentResponse.body;
                if (typeof body === "string"
                    || body instanceof Error) {
                    currentResponse.setHeader("content-type", "text/plain; charset=utf-8");
                }
                else if (serverUtils.SF.isFileInterface(body)) {
                    const filename = body.getName();
                    const filenameHeader = filename
                        ? ` filename="${filename}"`
                        : "";
                    currentResponse
                        .setHeader("content-type", body.getMimeType() ?? "application/octet-stream")
                        .setHeader("content-disposition", `attachment;${filenameHeader}`);
                }
                else if (typeof body === "object"
                    || typeof body === "number"
                    || typeof body === "boolean") {
                    currentResponse.setHeader("content-type", "application/json; charset=utf-8");
                }
            }
            currentResponse.setHeader(informationHeaderKey, currentResponse.information);
            if (currentResponse instanceof predicted.PredictedResponse) {
                currentResponse.setHeader(predictedHeaderKey, "1");
            }
            else if (currentResponse instanceof serverSentEventsPredicted.ServerSentEventsPredictedResponse) {
                currentResponse.setHeader(predictedHeaderKey, "1");
                currentResponse.setHeader("transfer-encoding", "chunked");
                currentResponse.setHeader("content-type", "text/event-stream");
                currentResponse.setHeader("cache-control", "no-cache");
                currentResponse.setHeader("connection", "keep-alive");
            }
            else if (currentResponse instanceof hook.HookResponse) {
                currentResponse.setHeader(fromHookHeaderKey, currentResponse.fromHook);
            }
            return next();
        },
    });
}

exports.initDefaultHook = initDefaultHook;
