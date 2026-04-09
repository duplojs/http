import { stringToMillisecond } from '@duplojs/utils';
import { Stream } from './stream.mjs';

/* eslint-disable @typescript-eslint/prefer-for-of */
var ServerSentEvents;
(function (ServerSentEvents) {
    const regexServerSentEventSplitStringData = /\r\n|\r|\n/;
    const nullIdRegexp = /\0|\n|\r/;
    function init(startSendingEvents, initParams) {
        return Stream.init((streamParams) => startSendingEvents({
            ...streamParams,
            lastId: initParams.lastId,
            send: (event, data, params) => {
                if (streamParams.isClose()) {
                    return Promise.resolve();
                }
                else if (streamParams.isAbort()) {
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
                    content += `retry: ${stringToMillisecond(params.retry)}\n`;
                }
                content += "\n";
                return streamParams.send(content);
            },
        }));
    }
    ServerSentEvents.init = init;
})(ServerSentEvents || (ServerSentEvents = {}));

export { ServerSentEvents };
