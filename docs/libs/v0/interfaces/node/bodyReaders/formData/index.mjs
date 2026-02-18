import '../../../../core/request/index.mjs';
import { SF } from '@duplojs/server-utils';
import { stringToBytes, A, E, Path, unwrap, TheFormData, O } from '@duplojs/utils';
import { readRequestFormData } from './readRequestFormData.mjs';
import { createWriteStream } from 'node:fs';
import '../../../../core/errors/index.mjs';
export { BodyParseFormDataError } from './error.mjs';
import { FormDataBodyController } from '../../../../core/request/bodyController/formData.mjs';
import { WrongContentTypeError } from '../../../../core/errors/wrongContentTypeError.mjs';

function createFormDataBodyReaderImplementation(serverParams) {
    const serverMaxBodySize = stringToBytes(serverParams.maxBodySize);
    function addValue(mapResult, fieldName, newValue) {
        const value = mapResult.get(fieldName);
        if (value === undefined) {
            mapResult.set(fieldName, newValue);
        }
        else {
            mapResult.set(fieldName, A.push(A.coalescing(value), newValue));
        }
    }
    return FormDataBodyController.createReaderImplementation(async (request, params) => {
        if (!request.headers["content-type"]?.includes("multipart/form-data")) {
            return E.error(new WrongContentTypeError("multipart/form-data", A.join(A.coalescing(request.headers["content-type"] ?? ""), " ")));
        }
        const filesAttache = [];
        request.filesAttache = filesAttache;
        const result = await readRequestFormData(request.raw.request, new Map(), {
            maxBodySize: params.bodyMaxSize ?? serverMaxBodySize,
            fileMaxSize: params.fileMaxSize ?? Infinity,
            maxFileQuantity: params.maxFileQuantity,
            mimeType: params.mimeType,
            maxBufferSize: params.maxBufferSize,
            maxKeyLength: params.maxKeyLength,
        }, (header) => {
            const fieldName = header.name;
            if (header.filename) {
                const extension = Path.getExtensionName(header.filename);
                const displayExtension = extension ? `.${extension}` : "";
                const filePath = Path.resolveRelative([
                    serverParams.uploadFolder,
                    `${Date.now().toString()}${displayExtension}`,
                ]);
                filesAttache.push(filePath);
                const currentFile = createWriteStream(filePath, {
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
                        addValue(valueAccumulator, fieldName, SF.createFileInterface(currentFile.path.toString()));
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
        if (E.isLeft(result)) {
            // mandatory in case of error to avoid monopolizing the client connection if a stream is not finished.
            request.raw.response.setHeader("Connection", "close");
            if (E.hasInformation(result, "server-error")) {
                throw unwrap(result);
            }
            return result;
        }
        if (request.headers["content-type-options"]?.includes("advanced")) {
            return E.success(TheFormData.fromEntries(result.entries(), params.maxIndexArray));
        }
        return E.success(O.fromEntries(result.entries()));
    });
}

export { createFormDataBodyReaderImplementation, readRequestFormData };
