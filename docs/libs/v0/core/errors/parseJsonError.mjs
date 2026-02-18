import { createCoreLibKind } from '../kind.mjs';
import { kindHeritage } from '@duplojs/utils';

class ParseJsonError extends kindHeritage("parse-json-error", createCoreLibKind("parse-json-error"), Error) {
    payload;
    error;
    constructor(payload, error) {
        super({}, ["Error when parse on json."]);
        this.payload = payload;
        this.error = error;
    }
}

export { ParseJsonError };
