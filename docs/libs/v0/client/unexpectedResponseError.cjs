'use strict';

var utils = require('@duplojs/utils');
var kind = require('./kind.cjs');

class UnexpectedInformationResponseError extends utils.kindHeritage("unexpected-information-response-error", kind.createClientKind("unexpected-information-response-error"), Error) {
    information;
    response;
    constructor(information, response) {
        super({}, ["Unexpected information response."]);
        this.information = information;
        this.response = response;
    }
}
class UnexpectedCodeResponseError extends utils.kindHeritage("unexpected-code-response-error", kind.createClientKind("unexpected-code-response-error"), Error) {
    code;
    response;
    constructor(code, response) {
        super({}, ["Unexpected code response."]);
        this.code = code;
        this.response = response;
    }
}
class UnexpectedResponseTypeError extends utils.kindHeritage("unexpected-response-type-error", kind.createClientKind("unexpected-response-type-error"), Error) {
    expectType;
    response;
    constructor(expectType, response) {
        super({}, ["Unexpected response type."]);
        this.expectType = expectType;
        this.response = response;
    }
}
class UnexpectedResponseError extends utils.kindHeritage("unexpected-response-error", kind.createClientKind("unexpected-response-error"), Error) {
    response;
    constructor(response) {
        super({}, ["Unexpected response."]);
        this.response = response;
    }
}

exports.UnexpectedCodeResponseError = UnexpectedCodeResponseError;
exports.UnexpectedInformationResponseError = UnexpectedInformationResponseError;
exports.UnexpectedResponseError = UnexpectedResponseError;
exports.UnexpectedResponseTypeError = UnexpectedResponseTypeError;
