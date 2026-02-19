'use strict';

require('../../../core/route/index.cjs');
var serverUtils = require('@duplojs/server-utils');
var utils = require('@duplojs/utils');
var node_fs = require('node:fs');
var hooks = require('../../../core/route/hooks.cjs');

const nodeHook = hooks.createHookRouteLifeCycle({
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
        else if (serverUtils.SF.isFileInterface(body)) {
            await new Promise((resolve, reject) => {
                node_fs.createReadStream(body.path)
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
            await Promise.all(utils.A.map(request.filesAttache, (path) => serverUtils.SF.remove(path)));
        }
        return next();
    },
});

exports.nodeHook = nodeHook;
