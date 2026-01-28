'use strict';

var builder = require('./builder.cjs');
require('../route/index.cjs');
var utils = require('@duplojs/utils');
var builder$1 = require('../route/builder.cjs');

builder.preflightBuilder.set("useRouteBuilder", ({ args: [method, paths, options,], accumulator, }) => builder$1.routeBuilderHandler.use({
    method,
    paths: utils.A.coalescing(paths),
    preflightSteps: accumulator.preflightSteps,
    steps: [],
    hooks: [
        ...(options?.hooks ?? []),
        ...accumulator.hooks,
    ],
    metadata: [
        ...(options?.metadata ?? []),
        ...accumulator.metadata,
    ],
}));
