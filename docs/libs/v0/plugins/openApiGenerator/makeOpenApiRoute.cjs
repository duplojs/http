'use strict';

require('../../core/builders/index.cjs');
require('../../core/metadata/index.cjs');
require('../../core/response/index.cjs');
var utils = require('@duplojs/utils');
var builder = require('../../core/builders/route/builder.cjs');
var ignoreByRouteStore = require('../../core/metadata/ignoreByRouteStore.cjs');
var contract = require('../../core/response/contract.cjs');

function makeOpenApiRoute(routePath, openApiPage) {
    return builder.useRouteBuilder("GET", routePath, { metadata: [ignoreByRouteStore.IgnoreByRouteStoreMetadata()] })
        .handler(contract.ResponseContract.ok("swaggerUi", utils.DP.string()), (__, { response }) => response("swaggerUi", openApiPage)
        .setHeader("content-type", "text/html"));
}

exports.makeOpenApiRoute = makeOpenApiRoute;
