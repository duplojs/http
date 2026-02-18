'use strict';

var kind = require('../kind.cjs');
var utils = require('@duplojs/utils');

class NotFoundBodyReaderImplementationError extends utils.kindHeritage("not-found-body-reader-implementation-error", kind.createCoreLibKind("not-found-body-reader-implementation-error"), Error) {
    route;
    bodyController;
    constructor(route, bodyController) {
        super({}, ["Body reader implementation not found."]);
        this.route = route;
        this.bodyController = bodyController;
    }
}

exports.NotFoundBodyReaderImplementationError = NotFoundBodyReaderImplementationError;
