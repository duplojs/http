'use strict';

var utils = require('@duplojs/utils');
var kind = require('../kind.cjs');

class BodyParseUnknownError extends utils.kindHeritage("body-parse-unknown-error", kind.createInterfacesNodeLibKind("body-parse-unknown-error"), Error) {
    contentType;
    unknownError;
    constructor(contentType, unknownError) {
        super({}, [`Error when parsing body with '${contentType}' content-type.`]);
        this.contentType = contentType;
        this.unknownError = unknownError;
    }
}

exports.BodyParseUnknownError = BodyParseUnknownError;
