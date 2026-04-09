'use strict';

var GG = require('@duplojs/utils/generator');
var hooks = require('./hooks.cjs');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var GG__namespace = /*#__PURE__*/_interopNamespaceDefault(GG);

const closeReason = Symbol("CloseReason");
function makeClientStreamResponse(response) {
    const reader = response.raw.body?.getReader();
    const abortController = response.requestParams.abortController;
    const createStreamResponse = (streamReaderGenerator) => {
        let closeStream = undefined;
        let receiveDataStream = undefined;
        let errorStream = undefined;
        let startStream = undefined;
        const streamResponse = {
            ...response,
            handlerType: "stream",
            onStream: (event, callback) => {
                if (event === "close") {
                    closeStream ??= [];
                    closeStream.push(callback);
                }
                else if (event === "receiveData") {
                    receiveDataStream ??= [];
                    receiveDataStream.push(callback);
                }
                else if (event === "error") {
                    errorStream ??= [];
                    errorStream.push(callback);
                }
                else if (event === "start") {
                    startStream ??= [];
                    startStream.push(callback);
                }
                return streamResponse;
            },
            closeStream: () => {
                abortController.abort(closeReason);
                void reader?.cancel(closeReason);
            },
            consumeStream: async () => {
                for await (const __ of streamResponse) { }
            },
            [Symbol.asyncIterator]: async function* () {
                await hooks.launchStartStreamHook(response.requestParams.hooks.startStream, startStream ?? [], streamResponse).catch(console.error);
                const onError = (error) => hooks.launchErrorStreamHook(response.requestParams.hooks.errorStream, errorStream ?? [], error, streamResponse).catch(console.error);
                const generator = streamReaderGenerator(onError);
                try {
                    for await (const event of generator) {
                        await hooks.launchReceiveDataStreamHook(response.requestParams.hooks.receiveDataStream, receiveDataStream ?? [], event, streamResponse).catch(console.error);
                        yield event;
                    }
                }
                finally {
                    await hooks.launchCloseStreamHook(response.requestParams.hooks.closeStream, closeStream ?? [], streamResponse).catch(console.error);
                }
            },
        };
        return streamResponse;
    };
    if (!reader || response.code === "204") {
        return createStreamResponse(async function* () { });
    }
    const textDecoder = response.headers.get("content-type")?.includes("text") && new TextDecoder("utf-8");
    return createStreamResponse((emitError) => GG__namespace.asyncLoop(async ({ next, exit }) => {
        try {
            if (abortController.signal.aborted) {
                return exit();
            }
            const result = await reader.read();
            if (textDecoder) {
                const chunk = textDecoder.decode(result.value, { stream: true }) || undefined;
                if (result.done) {
                    return exit(`${chunk ?? ""}${textDecoder.decode()}` || undefined);
                }
                return next(chunk);
            }
            else if (result.done) {
                return exit(result.value);
            }
            else {
                return next(result.value);
            }
        }
        catch (error) {
            if (error !== closeReason) {
                await emitError(error);
            }
            return exit();
        }
    }));
}
function isClientStreamResponse(response) {
    return Symbol.asyncIterator in response && response.handlerType === "stream";
}

exports.isClientStreamResponse = isClientStreamResponse;
exports.makeClientStreamResponse = makeClientStreamResponse;
