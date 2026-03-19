'use strict';

const maxAgeFunction = {
    default(maxAge) {
        return (request, response) => {
            response.setHeader("access-control-max-age", maxAge);
        };
    },
};

exports.maxAgeFunction = maxAgeFunction;
