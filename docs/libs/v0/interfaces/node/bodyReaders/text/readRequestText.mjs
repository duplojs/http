import '../../../../core/errors/index.mjs';
import { E } from '@duplojs/utils';
import { BodyParseWrongChunkReceived } from '../../../../core/errors/bodyParseWrongChunkReceived.mjs';
import { BodySizeExceedsLimitError } from '../../../../core/errors/bodySizeExceedsLimitError.mjs';

async function readRequestText(request, params, onEnd) {
    let result = "";
    let size = 0;
    try {
        for await (const chunk of request) {
            if (!(chunk instanceof Buffer) && typeof chunk !== "string") {
                return E.error(new BodyParseWrongChunkReceived("Buffer or String.", chunk));
            }
            size += chunk instanceof Buffer
                ? chunk.byteLength
                : Buffer.byteLength(chunk);
            if (size > params.maxBodySize) {
                return E.error(new BodySizeExceedsLimitError(params.maxBodySize));
            }
            result += chunk.toString();
        }
        if (onEnd) {
            return await onEnd(result);
        }
        return result;
    }
    catch (error) {
        return E.left("server-error", error);
    }
    finally {
        request.destroy();
    }
}

export { readRequestText };
