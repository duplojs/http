'use strict';

const exposeHeadersFunction = {
    default(exposeHeaders) {
        return (request, response) => {
            response.setHeader("Access-Control-Expose-Headers", exposeHeaders);
        };
    },
};

exports.exposeHeadersFunction = exposeHeadersFunction;
