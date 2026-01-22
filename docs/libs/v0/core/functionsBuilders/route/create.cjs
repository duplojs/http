'use strict';

var utils = require('@duplojs/utils');

function createRouteFunctionBuilder(support, builder) {
    return (route, params) => support(route)
        ? builder(route, params)
        : Promise.resolve(utils.E.left("routeNotSupport", route));
}

exports.createRouteFunctionBuilder = createRouteFunctionBuilder;
