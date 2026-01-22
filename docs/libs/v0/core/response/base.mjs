import { kindHeritage, O } from '@duplojs/utils';
import { createCoreLibKind } from '../kind.mjs';

class Response extends kindHeritage("response", createCoreLibKind("response")) {
    code;
    information;
    body;
    headers = undefined;
    constructor(code, information, body) {
        super();
        this.code = code;
        this.information = information;
        this.body = body;
    }
    setHeaders(headers) {
        this.headers = O.override(this.headers ?? {}, headers);
        return this;
    }
    setHeader(key, header) {
        if (!this.headers) {
            this.headers = {};
        }
        if (typeof header !== "undefined") {
            this.headers[key] = header;
        }
        return this;
    }
    deleteHeader(key) {
        if (!this.headers) {
            return this;
        }
        const { [key]: deleteHeader, ...rest } = this.headers;
        this.headers = rest;
        return this;
    }
}

export { Response };
