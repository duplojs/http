'use strict';

require('../../../../core/errors/index.cjs');
var utils = require('@duplojs/utils');
var bodyParseWrongChunkReceived = require('../../../../core/errors/bodyParseWrongChunkReceived.cjs');
var bodySizeExceedsLimitError = require('../../../../core/errors/bodySizeExceedsLimitError.cjs');

async function readRequestText(request, params, onEnd) {
    let result = "";
    let size = 0;
    try {
        for await (const chunk of request) {
            if (!(chunk instanceof Buffer) && typeof chunk !== "string") {
                return utils.E.error(new bodyParseWrongChunkReceived.BodyParseWrongChunkReceived("Buffer or String.", chunk));
            }
            size += chunk instanceof Buffer
                ? chunk.byteLength
                : Buffer.byteLength(chunk);
            if (size > params.maxBodySize) {
                return utils.E.error(new bodySizeExceedsLimitError.BodySizeExceedsLimitError(params.maxBodySize));
            }
            result += chunk.toString();
        }
        if (onEnd) {
            return await onEnd(result);
        }
        return result;
    }
    catch (error) {
        return utils.E.left("server-error", error);
    }
    finally {
        request.destroy();
    }
}

exports.readRequestText = readRequestText;
