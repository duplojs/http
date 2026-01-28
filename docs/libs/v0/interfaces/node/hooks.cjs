'use strict';

require('../../core/route/index.cjs');
var utils = require('@duplojs/utils');
require('./error/index.cjs');
require('../../core/response/index.cjs');
var hooks = require('../../core/route/hooks.cjs');
var predicted = require('../../core/response/predicted.cjs');
var hook = require('../../core/response/hook.cjs');
var bodySizeExceedsLimitError = require('./error/bodySizeExceedsLimitError.cjs');
var bodyParseWrongChunkReceived = require('./error/bodyParseWrongChunkReceived.cjs');
var bodyParseUnknownError = require('./error/bodyParseUnknownError.cjs');

function makeNodeHook(hub, serverParams) {
    const informationHeaderKey = serverParams.informationHeaderKey;
    const predictedHeaderKey = serverParams.predictedHeaderKey;
    const fromHookHeaderKey = serverParams.fromHookHeaderKey;
    const isDev = hub.config.environment === "DEV";
    const maxBodySize = utils.stringToBytes(serverParams.maxBodySize);
    return hooks.createHookRouteLifeCycle({
        async parseBody({ request, exit }) {
            const contentType = request.headers["content-type"] instanceof Array
                ? request.headers["content-type"].join(", ")
                : request.headers["content-type"] ?? "";
            const isText = contentType.includes("text/plain");
            const isJson = contentType.includes("application/json");
            if (!isText && !isJson) {
                return exit();
            }
            const { request: rawRequest } = request.raw;
            request.body = await new Promise((resolve, reject) => {
                function errorCallback(error) {
                    if (error instanceof bodySizeExceedsLimitError.BodySizeExceedsLimitError
                        || error instanceof bodyParseWrongChunkReceived.BodyParseWrongChunkReceived) {
                        reject(error);
                        return;
                    }
                    reject(new bodyParseUnknownError.BodyParseUnknownError(contentType, error));
                }
                let stringBody = "";
                let byteLengthBody = 0;
                rawRequest.on("error", errorCallback);
                rawRequest.on("data", (chunk) => {
                    if (!(chunk instanceof Buffer) && typeof chunk !== "string") {
                        rawRequest.emit("error", new bodyParseWrongChunkReceived.BodyParseWrongChunkReceived(chunk));
                        return;
                    }
                    byteLengthBody += chunk instanceof Buffer
                        ? chunk.byteLength
                        : Buffer.byteLength(chunk);
                    if (byteLengthBody > maxBodySize) {
                        rawRequest.emit("error", new bodySizeExceedsLimitError.BodySizeExceedsLimitError(serverParams.maxBodySize));
                        return;
                    }
                    stringBody += chunk.toString();
                });
                rawRequest.on("end", () => {
                    try {
                        resolve(isText
                            ? stringBody
                            : JSON.parse(stringBody));
                    }
                    catch (error) {
                        errorCallback(error);
                    }
                });
            });
            return exit();
        },
        error({ error, response, exit }) {
            const displayedError = isDev ? error : undefined;
            if (error instanceof bodySizeExceedsLimitError.BodySizeExceedsLimitError) {
                return response("400", "body-size-exceeds-limit-error", displayedError);
            }
            else if (error instanceof bodyParseWrongChunkReceived.BodyParseWrongChunkReceived) {
                return response("400", "body-parse-wrong-chunk-received", displayedError);
            }
            else if (error instanceof bodyParseUnknownError.BodyParseUnknownError) {
                return response("400", "body-parse-unknown-error", displayedError);
            }
            return exit();
        },
        beforeSendResponse({ request, currentResponse, exit }) {
            if (!currentResponse.headers?.["content-type"]) {
                const body = currentResponse.body;
                if (typeof body === "string"
                    || body instanceof Error) {
                    currentResponse.setHeader("content-type", "text/plain; charset=utf-8");
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
            else if (currentResponse instanceof hook.HookResponse) {
                currentResponse.setHeader(fromHookHeaderKey, currentResponse.fromHook);
            }
            request.raw.response.writeHead(Number(currentResponse.code), currentResponse.headers);
            return exit();
        },
        sendResponse({ request, currentResponse, exit }) {
            const { response: rawResponse } = request.raw;
            const body = currentResponse.body;
            if (body instanceof Error) {
                rawResponse.write(body.toString());
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
    });
}

exports.makeNodeHook = makeNodeHook;
