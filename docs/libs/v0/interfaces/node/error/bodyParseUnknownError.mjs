import { kindHeritage } from '@duplojs/utils';
import { createInterfacesNodeLibKind } from '../kind.mjs';

class BodyParseUnknownError extends kindHeritage("body-parse-unknown-error", createInterfacesNodeLibKind("body-parse-unknown-error"), Error) {
    contentType;
    unknownError;
    constructor(contentType, unknownError) {
        super({}, [`Error when parsing body with '${contentType}' content-type.`]);
        this.contentType = contentType;
        this.unknownError = unknownError;
    }
}

export { BodyParseUnknownError };
