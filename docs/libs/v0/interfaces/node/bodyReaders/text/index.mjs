import '../../../../core/request/index.mjs';
import { readRequestText } from './readRequestText.mjs';
import { stringToBytes, E, A, unwrap } from '@duplojs/utils';
import '../../../../core/errors/index.mjs';
import { TextBodyController } from '../../../../core/request/bodyController/text.mjs';
import { WrongContentTypeError } from '../../../../core/errors/wrongContentTypeError.mjs';
import { ParseJsonError } from '../../../../core/errors/parseJsonError.mjs';

function createTextBodyReaderImplementation(serverParams) {
    const serverMaxBodySize = stringToBytes(serverParams.maxBodySize);
    return TextBodyController.createReaderImplementation(async (request, params) => {
        if (!request.headers["content-type"]?.includes("application/json")
            && !request.headers["content-type"]?.includes("text/plain")) {
            return E.error(new WrongContentTypeError("application/json or text/plain", A.join(A.coalescing(request.headers["content-type"] ?? ""), " ")));
        }
        const result = await readRequestText(request.raw.request, { maxBodySize: params.bodyMaxSize ?? serverMaxBodySize }, (result) => {
            if (request.headers["content-type"]?.includes("application/json")) {
                try {
                    return E.success(JSON.parse(result));
                }
                catch (error) {
                    return E.error(new ParseJsonError(result, error));
                }
            }
            return E.success(result);
        });
        if (E.isLeft(result)) {
            // mandatory in case of error to avoid monopolizing the client connection if a stream is not finished.
            request.raw.response.setHeader("Connection", "close");
        }
        if (E.hasInformation(result, "server-error")) {
            throw unwrap(result);
        }
        return result;
    });
}

export { createTextBodyReaderImplementation, readRequestText };
