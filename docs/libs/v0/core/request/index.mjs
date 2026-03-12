import { kindHeritage, createExternalPromise, E } from '@duplojs/utils';
import { createCoreLibKind } from '../kind.mjs';
import './bodyController/index.mjs';

class Request extends kindHeritage("request", createCoreLibKind("request")) {
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
        const externalPromise = createExternalPromise();
        this.bodyResult = externalPromise.promise;
        return this.bodyReader
            .read(this)
            .then((result) => {
            externalPromise.resolve(result);
            this.bodyResult = result;
            return result;
        })
            .catch((error) => {
            const result = E.error(error);
            externalPromise.resolve(result);
            return result;
        });
    }
}

export { Request };
