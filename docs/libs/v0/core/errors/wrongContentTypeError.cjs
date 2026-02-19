'use strict';

var kind = require('../kind.cjs');
var utils = require('@duplojs/utils');

class WrongContentTypeError extends utils.kindHeritage("wrong-content-type-error", kind.createCoreLibKind("wrong-content-type-error"), Error) {
    expectedContentType;
    contentType;
    constructor(expectedContentType, contentType) {
        super({}, [`expect content-type "${expectedContentType}" but receive "${contentType}".`]);
        this.expectedContentType = expectedContentType;
        this.contentType = contentType;
    }
}

exports.WrongContentTypeError = WrongContentTypeError;
