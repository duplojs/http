import '../../../core/route/index.mjs';
import { SF } from '@duplojs/server-utils';
import { A } from '@duplojs/utils';
import { createReadStream } from 'node:fs';
import { createHookRouteLifeCycle } from '../../../core/route/hooks.mjs';

const nodeHook = createHookRouteLifeCycle({
    beforeSendResponse({ request, currentResponse, exit }) {
        request.raw.response.writeHead(Number(currentResponse.code), currentResponse.headers);
        return exit();
    },
    async sendResponse({ request, currentResponse, exit }) {
        const { response: rawResponse } = request.raw;
        const body = currentResponse.body;
        if (body instanceof Error) {
            rawResponse.write(body.toString());
        }
        else if (SF.isFileInterface(body)) {
            await new Promise((resolve, reject) => {
                createReadStream(body.path)
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
            await Promise.all(A.map(request.filesAttache, (path) => SF.remove(path)));
        }
        return next();
    },
});

export { nodeHook };
