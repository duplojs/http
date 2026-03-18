const allowOriginFunction = {
    default(allowOrigin) {
        return (request, response) => {
            if (allowOrigin.test(request.origin)) {
                response.setHeader("Access-Control-Allow-Origin", request.origin);
            }
        };
    },
    isFunction(allowOrigin) {
        return async (request, response) => {
            if (await allowOrigin(request.origin) === true) {
                response.setHeader("Access-Control-Allow-Origin", request.origin);
            }
        };
    },
};

export { allowOriginFunction };
