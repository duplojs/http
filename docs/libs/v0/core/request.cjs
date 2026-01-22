'use strict';

var utils = require('@duplojs/utils');
var kind = require('./kind.cjs');

class Request extends utils.kindHeritage("request", kind.createCoreLibKind("request")) {
    method;
    headers;
    url;
    host;
    origin;
    path;
    params;
    query;
    matchedPath;
    body = undefined;
    constructor({ method, headers, url, host, origin, path, params, query, matchedPath, ...rest }) {
        super();
        this.method = method;
        this.headers = headers;
        this.url = url;
        this.host = host;
        this.origin = origin;
        this.path = path;
        this.params = params;
        this.query = query;
        this.matchedPath = matchedPath;
        for (const key in rest) {
            this[key] = rest[key];
        }
    }
}

exports.Request = Request;
