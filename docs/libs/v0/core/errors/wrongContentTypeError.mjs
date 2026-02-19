import { createCoreLibKind } from '../kind.mjs';
import { kindHeritage } from '@duplojs/utils';

class WrongContentTypeError extends kindHeritage("wrong-content-type-error", createCoreLibKind("wrong-content-type-error"), Error) {
    expectedContentType;
    contentType;
    constructor(expectedContentType, contentType) {
        super({}, [`expect content-type "${expectedContentType}" but receive "${contentType}".`]);
        this.expectedContentType = expectedContentType;
        this.contentType = contentType;
    }
}

export { WrongContentTypeError };
