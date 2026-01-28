'use strict';

var index = require('../../route/index.cjs');
require('../../steps/index.cjs');
var utils = require('@duplojs/utils');
var builder = require('./builder.cjs');
var store = require('./store.cjs');
require('../../metadata/index.cjs');
var handler = require('../../steps/handler.cjs');
var ignoreByRouteStore = require('../../metadata/ignoreByRouteStore.cjs');

builder.routeBuilderHandler.set("handler", ({ args: [responseContract, theFunction, ...metadata], accumulator, }) => {
    const route = index.createRoute({
        ...accumulator,
        steps: [
            ...accumulator.steps,
            handler.createHandlerStep({
                responseContract,
                theFunction,
                metadata,
            }),
        ],
    });
    const ignoreByRouteStoreMetadata = utils.A.find(accumulator.metadata, ignoreByRouteStore.IgnoreByRouteStoreMetadata.is);
    if (ignoreByRouteStoreMetadata === undefined) {
        store.routeStore.add(route);
    }
    return route;
});
