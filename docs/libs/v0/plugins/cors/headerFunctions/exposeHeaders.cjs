'use strict';

const exposeHeadersFunction = {
    default(exposeHeaders) {
        return (request, response) => {
            response.setHeader("access-control-expose-headers", exposeHeaders);
        };
    },
};

exports.exposeHeadersFunction = exposeHeadersFunction;
