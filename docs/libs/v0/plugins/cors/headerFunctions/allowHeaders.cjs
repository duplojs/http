'use strict';

const allowHeadersFunction = {
    default(allowHeaders) {
        return (request, response) => {
            response.setHeader("Access-Control-Allow-Headers", allowHeaders);
        };
    },
};

exports.allowHeadersFunction = allowHeadersFunction;
