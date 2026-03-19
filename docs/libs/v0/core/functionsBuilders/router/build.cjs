'use strict';

async function buildRouterFunction({ routerFunctionBuilder, ...params }) {
    return routerFunctionBuilder(params);
}

exports.buildRouterFunction = buildRouterFunction;
