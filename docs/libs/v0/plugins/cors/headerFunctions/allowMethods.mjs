const allowMethodsFunction = {
    default(methods) {
        return (request, response) => {
            response.setHeader("Access-Control-Allow-Methods", methods);
        };
    },
    isBool(allowMethods) {
        return (request, response) => {
            response.setHeader("Access-Control-Allow-Methods", allowMethods[request.path]);
        };
    },
};

export { allowMethodsFunction };
