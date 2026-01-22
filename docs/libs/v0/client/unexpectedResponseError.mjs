import { kindHeritage } from '@duplojs/utils';
import { createClientKind } from './kind.mjs';

class UnexpectedInformationResponseError extends kindHeritage("unexpected-information-response-error", createClientKind("unexpected-information-response-error"), Error) {
    information;
    response;
    constructor(information, response) {
        super({}, ["Unexpected information response."]);
        this.information = information;
        this.response = response;
    }
}
class UnexpectedCodeResponseError extends kindHeritage("unexpected-code-response-error", createClientKind("unexpected-code-response-error"), Error) {
    code;
    response;
    constructor(code, response) {
        super({}, ["Unexpected code response."]);
        this.code = code;
        this.response = response;
    }
}
class UnexpectedResponseTypeError extends kindHeritage("unexpected-response-type-error", createClientKind("unexpected-response-type-error"), Error) {
    expectType;
    response;
    constructor(expectType, response) {
        super({}, ["Unexpected response type."]);
        this.expectType = expectType;
        this.response = response;
    }
}
class UnexpectedResponseError extends kindHeritage("unexpected-response-error", createClientKind("unexpected-response-error"), Error) {
    response;
    constructor(response) {
        super({}, ["Unexpected response."]);
        this.response = response;
    }
}

export { UnexpectedCodeResponseError, UnexpectedInformationResponseError, UnexpectedResponseError, UnexpectedResponseTypeError };
