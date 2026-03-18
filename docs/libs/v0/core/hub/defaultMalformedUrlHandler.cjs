'use strict';

require('../response/index.cjs');
require('../steps/index.cjs');
var handler = require('../steps/handler.cjs');
var contract = require('../response/contract.cjs');

const defaultMalformedUrlHandler = handler.createHandlerStep({
    responseContract: contract.ResponseContract.badRequest("malformed-url"),
    theFunction: (__, { response }) => response("malformed-url", undefined),
    metadata: [],
});

exports.defaultMalformedUrlHandler = defaultMalformedUrlHandler;
