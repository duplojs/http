'use strict';

var utils = require('@duplojs/utils');
var kind = require('../kind.cjs');
require('./bodyController/index.cjs');

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
    bodyReader;
    bodyResult = undefined;
    filesAttache = undefined;
    constructor({ method, headers, url, host, origin, path, params, query, matchedPath, bodyReader, ...rest }) {
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
        this.bodyReader = bodyReader;
        for (const key in rest) {
            this[key] = rest[key];
        }
    }
    getBody() {
        if (this.bodyResult !== undefined) {
            return this.bodyResult;
        }
        const externalPromise = utils.createExternalPromise();
        this.bodyResult = externalPromise.promise;
        return this.bodyReader
            .read(this)
            .then((result) => {
            externalPromise.resolve(result);
            this.bodyResult = result;
            return result;
        })
            .catch((error) => {
            const result = utils.E.error(error);
            externalPromise.resolve(result);
            return result;
        });
    }
}

exports.Request = Request;
