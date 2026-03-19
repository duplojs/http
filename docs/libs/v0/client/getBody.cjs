'use strict';

function getBody(response) {
    const responseContentType = response.headers.get("content-type") ?? undefined;
    if (!responseContentType) {
        return Promise.resolve(undefined);
    }
    else if (responseContentType.includes("text/event-stream")) {
        return Promise.resolve(undefined);
    }
    else if (responseContentType.includes("json")) {
        return response.json();
    }
    else if (responseContentType.includes("text")) {
        return response.text();
    }
    else {
        return Promise.resolve(undefined);
    }
}

exports.getBody = getBody;
