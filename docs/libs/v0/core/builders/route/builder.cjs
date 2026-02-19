'use strict';

var utils = require('@duplojs/utils');
var stringIdentifier = require('../../stringIdentifier.cjs');

const routeBuilderHandler = utils.createBuilder(stringIdentifier.createCoreLibStringIdentifier("route"));
function useRouteBuilder(method, path, options) {
    return routeBuilderHandler.use({
        method,
        paths: utils.A.coalescing(path),
        preflightSteps: [],
        steps: [],
        hooks: options?.hooks ?? [],
        metadata: options?.metadata ?? [],
        bodyController: options?.bodyController ?? null,
    });
}

exports.routeBuilderHandler = routeBuilderHandler;
exports.useRouteBuilder = useRouteBuilder;
