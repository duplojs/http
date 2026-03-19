const allowMethodsFunction = {
    default(methods) {
        return (request, response) => {
            response.setHeader("access-control-allow-methods", methods);
        };
    },
    isBool(allowMethods) {
        return (request, response) => {
            response.setHeader("access-control-allow-methods", allowMethods[request.path]);
        };
    },
};

export { allowMethodsFunction };
