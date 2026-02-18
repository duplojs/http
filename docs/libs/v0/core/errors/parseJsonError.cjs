'use strict';

var kind = require('../kind.cjs');
var utils = require('@duplojs/utils');

class ParseJsonError extends utils.kindHeritage("parse-json-error", kind.createCoreLibKind("parse-json-error"), Error) {
    payload;
    error;
    constructor(payload, error) {
        super({}, ["Error when parse on json."]);
        this.payload = payload;
        this.error = error;
    }
}

exports.ParseJsonError = ParseJsonError;
