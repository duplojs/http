'use strict';

var utils = require('@duplojs/utils');

/* eslint-disable @typescript-eslint/prefer-for-of */
exports.ServerSentEvents = void 0;
(function (ServerSentEvents) {
    const regexServerSentEventSplitStringData = /\r\n|\r|\n/;
    const nullIdRegexp = /\0|\n|\r/;
    function init(response, initParams) {
        const abortSubscribers = [];
        let isAbort = false;
        const handler = {
            async start(send, close) {
                if (isAbort) {
                    return;
                }
                let isClose = false;
                const closeSubscribers = [];
                const errorSubscribers = [];
                const params = {
                    send: (event, data, params) => {
                        if (isClose) {
                            return Promise.resolve();
                        }
                        else if (isAbort) {
                            return Promise.resolve();
                        }
                        let content = `event: ${event || "message"}\n`;
                        if (typeof data === "string") {
                            const splitData = data.split(regexServerSentEventSplitStringData);
                            for (let index = 0; index < splitData.length; index++) {
                                content += `data: ${splitData[index]}\n`;
                            }
                        }
                        else if (data !== undefined) {
                            content += `content-type: application/json\ndata: ${JSON.stringify(data)}\n`;
                        }
                        if (typeof params?.id === "string" && !nullIdRegexp.test(params.id)) {
                            content += `id: ${params.id}\n`;
                        }
                        if (params?.retry !== undefined) {
                            content += `retry: ${utils.stringToMillisecond(params.retry)}\n`;
                        }
                        content += "\n";
                        return send(content);
                    },
                    abort: handler.abort,
                    isAbort: () => isAbort,
                    onAbort: (theFunction) => void abortSubscribers.push(theFunction),
                    close: () => {
                        if (isClose === true) {
                            return;
                        }
                        isClose = true;
                        close();
                        for (let index = 0; index < closeSubscribers.length; index++) {
                            closeSubscribers[index]();
                        }
                    },
                    isClose: () => isClose,
                    onClose: (theFunction) => void closeSubscribers.push(theFunction),
                    error: (error) => {
                        for (let index = 0; index < errorSubscribers.length; index++) {
                            errorSubscribers[index](error);
                        }
                    },
                    onError: (theFunction) => void errorSubscribers.push(theFunction),
                    lastId: initParams.lastId && !nullIdRegexp.test(initParams.lastId)
                        ? initParams.lastId
                        : null,
                };
                try {
                    await response.startSendingEvents(params);
                }
                catch (error) {
                    params.error(error);
                }
                finally {
                    params.close();
                }
            },
            abort() {
                if (isAbort === true) {
                    return;
                }
                isAbort = true;
                for (let index = 0; index < abortSubscribers.length; index++) {
                    abortSubscribers[index]();
                }
            },
        };
        return handler;
    }
    ServerSentEvents.init = init;
})(exports.ServerSentEvents || (exports.ServerSentEvents = {}));
