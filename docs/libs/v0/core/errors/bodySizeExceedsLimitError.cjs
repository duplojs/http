'use strict';

var kind = require('../kind.cjs');
var utils = require('@duplojs/utils');

class BodySizeExceedsLimitError extends utils.kindHeritage("body-size-exceeds-limit-error", kind.createCoreLibKind("body-size-exceeds-limit-error"), Error) {
    bytesInString;
    constructor(bytesInString) {
        super({}, [`Body size is bigger than ${bytesInString}.`]);
        this.bytesInString = bytesInString;
    }
}

exports.BodySizeExceedsLimitError = BodySizeExceedsLimitError;
