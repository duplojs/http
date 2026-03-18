'use strict';

const credentialsFunction = {
    default() {
        return (request, response) => {
            response.setHeader("Access-Control-Allow-Credentials", "true");
        };
    },
};

exports.credentialsFunction = credentialsFunction;
