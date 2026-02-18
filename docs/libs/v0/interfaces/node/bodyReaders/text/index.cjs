'use strict';

require('../../../../core/request/index.cjs');
var readRequestText = require('./readRequestText.cjs');
var utils = require('@duplojs/utils');
require('../../../../core/errors/index.cjs');
var text = require('../../../../core/request/bodyController/text.cjs');
var wrongContentTypeError = require('../../../../core/errors/wrongContentTypeError.cjs');
var parseJsonError = require('../../../../core/errors/parseJsonError.cjs');

function createTextBodyReaderImplementation(serverParams) {
    const serverMaxBodySize = utils.stringToBytes(serverParams.maxBodySize);
    return text.TextBodyController.createReaderImplementation(async (request, params) => {
        if (!request.headers["content-type"]?.includes("application/json")
            && !request.headers["content-type"]?.includes("text/plain")) {
            return utils.E.error(new wrongContentTypeError.WrongContentTypeError("application/json or text/plain", utils.A.join(utils.A.coalescing(request.headers["content-type"] ?? ""), " ")));
        }
        const result = await readRequestText.readRequestText(request.raw.request, { maxBodySize: params.bodyMaxSize ?? serverMaxBodySize }, (result) => {
            if (request.headers["content-type"]?.includes("application/json")) {
                try {
                    return utils.E.success(JSON.parse(result));
                }
                catch (error) {
                    return utils.E.error(new parseJsonError.ParseJsonError(result, error));
                }
            }
            return utils.E.success(result);
        });
        if (utils.E.isLeft(result)) {
            // mandatory in case of error to avoid monopolizing the client connection if a stream is not finished.
            request.raw.response.setHeader("Connection", "close");
        }
        if (utils.E.hasInformation(result, "server-error")) {
            throw utils.unwrap(result);
        }
        return result;
    });
}

exports.readRequestText = readRequestText.readRequestText;
exports.createTextBodyReaderImplementation = createTextBodyReaderImplementation;
