'use strict';

var kind = require('../kind.cjs');
var utils = require('@duplojs/utils');

class RouterBuildError extends utils.kindHeritage("router-build-error", kind.createCoreLibKind("router-build-error"), Error) {
    route;
    element;
    constructor(route, element) {
        super({}, ["Error during build route."]);
        this.route = route;
        this.element = element;
    }
}

exports.RouterBuildError = RouterBuildError;
