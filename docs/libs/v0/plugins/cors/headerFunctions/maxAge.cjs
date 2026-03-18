'use strict';

const maxAgeFunction = {
    default(maxAge) {
        return (request, response) => {
            response.setHeader("Access-Control-Max-Age", maxAge);
        };
    },
};

exports.maxAgeFunction = maxAgeFunction;
