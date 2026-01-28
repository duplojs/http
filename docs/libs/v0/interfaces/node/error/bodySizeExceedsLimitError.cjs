'use strict';

var utils = require('@duplojs/utils');
var kind = require('../kind.cjs');

class BodySizeExceedsLimitError extends utils.kindHeritage("body-size-exceeds-limit-error", kind.createInterfacesNodeLibKind("body-size-exceeds-limit-error"), Error) {
    bytesInString;
    constructor(bytesInString) {
        super({}, [`Body size is bigger than ${bytesInString}.`]);
        this.bytesInString = bytesInString;
    }
}

exports.BodySizeExceedsLimitError = BodySizeExceedsLimitError;
