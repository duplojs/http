import '../../core/route/index.mjs';
import { stringToBytes } from '@duplojs/utils';
import './error/index.mjs';
import '../../core/response/index.mjs';
import { createHookRouteLifeCycle } from '../../core/route/hooks.mjs';
import { PredictedResponse } from '../../core/response/predicted.mjs';
import { HookResponse } from '../../core/response/hook.mjs';
import { BodySizeExceedsLimitError } from './error/bodySizeExceedsLimitError.mjs';
import { BodyParseWrongChunkReceived } from './error/bodyParseWrongChunkReceived.mjs';
import { BodyParseUnknownError } from './error/bodyParseUnknownError.mjs';

function makeNodeHook(hub, serverParams) {
    const informationHeaderKey = serverParams.informationHeaderKey;
    const predictedHeaderKey = serverParams.predictedHeaderKey;
    const fromHookHeaderKey = serverParams.fromHookHeaderKey;
    const isDev = hub.config.environment === "DEV";
    const maxBodySize = stringToBytes(serverParams.maxBodySize);
    return createHookRouteLifeCycle({
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
                    if (error instanceof BodySizeExceedsLimitError
                        || error instanceof BodyParseWrongChunkReceived) {
                        reject(error);
                        return;
                    }
                    reject(new BodyParseUnknownError(contentType, error));
                }
                let stringBody = "";
                let byteLengthBody = 0;
                rawRequest.on("error", errorCallback);
                rawRequest.on("data", (chunk) => {
                    if (!(chunk instanceof Buffer) && typeof chunk !== "string") {
                        rawRequest.emit("error", new BodyParseWrongChunkReceived(chunk));
                        return;
                    }
                    byteLengthBody += chunk instanceof Buffer
                        ? chunk.byteLength
                        : Buffer.byteLength(chunk);
                    if (byteLengthBody > maxBodySize) {
                        rawRequest.emit("error", new BodySizeExceedsLimitError(serverParams.maxBodySize));
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
            if (error instanceof BodySizeExceedsLimitError) {
                return response("400", "body-size-exceeds-limit-error", displayedError);
            }
            else if (error instanceof BodyParseWrongChunkReceived) {
                return response("400", "body-parse-wrong-chunk-received", displayedError);
            }
            else if (error instanceof BodyParseUnknownError) {
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
            if (currentResponse instanceof PredictedResponse) {
                currentResponse.setHeader(predictedHeaderKey, "1");
            }
            else if (currentResponse instanceof HookResponse) {
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

export { makeNodeHook };
