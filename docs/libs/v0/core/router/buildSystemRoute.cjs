'use strict';

var utils = require('@duplojs/utils');
require('../functionsBuilders/index.cjs');
require('../request/index.cjs');
var index = require('../route/index.cjs');
var buildError = require('./buildError.cjs');
var defaultEmptyReaderImplementation = require('../hub/defaultEmptyReaderImplementation.cjs');
var empty = require('../request/bodyController/empty.cjs');
var build = require('../functionsBuilders/route/build.cjs');

async function buildSystemRoute(params) {
    const bodyController = empty.controlBodyAsEmpty();
    const bodyReader = bodyController.createReaderOrThrow(defaultEmptyReaderImplementation.defaultEmptyReaderImplementation);
    const route = index.createRoute({
        method: "GET",
        paths: ["/"],
        hooks: [],
        preflightSteps: [],
        steps: [params.handlerStep],
        metadata: [],
        bodyController,
    });
    const buildedRoute = await utils.asyncPipe(build.buildRouteFunction(route, params.buildParams), utils.E.whenIsLeft((element) => {
        throw new buildError.RouterBuildError(route, element);
    }), utils.unwrap);
    return {
        bodyReader,
        buildedRoute,
    };
}

exports.buildSystemRoute = buildSystemRoute;
