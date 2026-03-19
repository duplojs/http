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
            if (await allowOrigin(request.origin) === true) {
                response.setHeader("access-control-allow-origin", request.origin);
            }
        };
    },
};

export { allowOriginFunction };
