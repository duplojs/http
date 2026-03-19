'use strict';

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

exports.allowMethodsFunction = allowMethodsFunction;
