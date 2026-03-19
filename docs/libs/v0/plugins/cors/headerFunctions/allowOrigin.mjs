const allowOriginFunction = {
    default(allowOrigin) {
        return (request, response) => {
            if (allowOrigin.test(request.origin)) {
                response.setHeader("access-control-allow-origin", request.origin);
            }
        };
    },
    isFunction(allowOrigin) {
        return async (request, response) => {
            let result = allowOrigin(request.origin);
            if (result instanceof Promise) {
                result = await result;
            }
            if (result === true) {
                response.setHeader("access-control-allow-origin", request.origin);
            }
        };
    },
};

export { allowOriginFunction };
