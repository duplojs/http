'use strict';

require('../../../../core/request/index.cjs');
var serverUtils = require('@duplojs/server-utils');
var utils = require('@duplojs/utils');
var readRequestFormData = require('./readRequestFormData.cjs');
var node_fs = require('node:fs');
require('../../../../core/errors/index.cjs');
var error = require('./error.cjs');
var formData = require('../../../../core/request/bodyController/formData.cjs');
var wrongContentTypeError = require('../../../../core/errors/wrongContentTypeError.cjs');

function createFormDataBodyReaderImplementation(serverParams) {
    const serverMaxBodySize = utils.stringToBytes(serverParams.maxBodySize);
    function addValue(mapResult, fieldName, newValue) {
        const value = mapResult.get(fieldName);
        if (value === undefined) {
            mapResult.set(fieldName, newValue);
        }
        else {
            mapResult.set(fieldName, utils.A.push(utils.A.coalescing(value), newValue));
        }
    }
    return formData.FormDataBodyController.createReaderImplementation(async (request, params) => {
        if (!request.headers["content-type"]?.includes("multipart/form-data")) {
            return utils.E.error(new wrongContentTypeError.WrongContentTypeError("multipart/form-data", utils.A.join(utils.A.coalescing(request.headers["content-type"] ?? ""), " ")));
        }
        const filesAttache = [];
        request.filesAttache = filesAttache;
        const result = await readRequestFormData.readRequestFormData(request.raw.request, new Map(), {
            maxBodySize: params.bodyMaxSize ?? serverMaxBodySize,
            fileMaxSize: params.fileMaxSize ?? Infinity,
            maxFileQuantity: params.maxFileQuantity,
            mimeType: params.mimeType,
            maxBufferSize: params.maxBufferSize,
            maxKeyLength: params.maxKeyLength,
        }, (header) => {
            const fieldName = header.name;
            if (header.filename) {
                const extension = utils.Path.getExtensionName(header.filename);
                const displayExtension = extension ? `.${extension}` : "";
                const filePath = utils.Path.resolveRelative([
                    serverParams.uploadFolder,
                    `${Date.now().toString()}${displayExtension}`,
                ]);
                filesAttache.push(filePath);
                const currentFile = node_fs.createWriteStream(filePath, {
                    highWaterMark: request.raw.request.readableHighWaterMark,
                });
                return {
                    onReceiveChunk: (chunk) => new Promise((resolve, reject) => void currentFile.write(chunk, (result) => {
                        if (result instanceof Error) {
                            return void reject(result);
                        }
                        return void resolve();
                    })),
                    onEndPart: (valueAccumulator) => {
                        currentFile.end();
                        addValue(valueAccumulator, fieldName, serverUtils.SF.createFileInterface(currentFile.path.toString()));
                        return valueAccumulator;
                    },
                    onError: () => void currentFile.end(),
                };
            }
            let currentValue = "";
            return {
                onReceiveChunk: (chunk) => {
                    currentValue += chunk.toString("utf-8");
                },
                onEndPart: (valueAccumulator) => {
                    addValue(valueAccumulator, fieldName, currentValue);
                    return valueAccumulator;
                },
                onError: null,
            };
        });
        if (utils.E.isLeft(result)) {
            // mandatory in case of error to avoid monopolizing the client connection if a stream is not finished.
            request.raw.response.setHeader("Connection", "close");
            if (utils.E.hasInformation(result, "server-error")) {
                throw utils.unwrap(result);
            }
            return result;
        }
        if (request.headers["content-type-options"]?.includes("advanced")) {
            return utils.E.success(utils.TheFormData.fromEntries(result.entries(), params.maxIndexArray));
        }
        return utils.E.success(utils.O.fromEntries(result.entries()));
    });
}

exports.readRequestFormData = readRequestFormData.readRequestFormData;
exports.BodyParseFormDataError = error.BodyParseFormDataError;
exports.createFormDataBodyReaderImplementation = createFormDataBodyReaderImplementation;
