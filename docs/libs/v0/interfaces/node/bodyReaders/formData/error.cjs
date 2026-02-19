'use strict';

var utils = require('@duplojs/utils');
var kind = require('../../kind.cjs');

class BodyParseFormDataError extends utils.kindHeritage("body-parse-form-data-error", kind.createInterfacesNodeLibKind("body-parse-form-data-error"), Error) {
    information;
    constructor(information) {
        super({}, [`Body parse form date error: ${information}`]);
        this.information = information;
    }
}

exports.BodyParseFormDataError = BodyParseFormDataError;
