'use strict';

exports.Stream = void 0;
(function (Stream) {
    function init(startStream) {
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
                    send: async (...args) => {
                        if (isClose) {
                            return Promise.resolve();
                        }
                        else if (isAbort) {
                            return Promise.resolve();
                        }
                        for (let index = 0; index < args.length; index++) {
                            await send(args[index]);
                        }
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
                };
                try {
                    await startStream(params);
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
    Stream.init = init;
})(exports.Stream || (exports.Stream = {}));
