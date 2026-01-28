'use strict';

require('../response/index.cjs');
require('../steps/index.cjs');
var utils = require('@duplojs/utils');
var handler = require('../steps/handler.cjs');
var contract = require('../response/contract.cjs');

const defaultNotfoundHandler = handler.createHandlerStep({
    responseContract: contract.ResponseContract.notFound("notfound-route", utils.DP.string()),
    theFunction: (floor, { request, response }) => response("notfound-route", `${request.method}:${request.path}`),
    metadata: [],
});

exports.defaultNotfoundHandler = defaultNotfoundHandler;
