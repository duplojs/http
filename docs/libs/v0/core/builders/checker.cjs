'use strict';

var checker = require('../checker.cjs');
var stringIdentifier = require('../stringIdentifier.cjs');
var utils = require('@duplojs/utils');

const checkerBuilder = utils.createBuilder(stringIdentifier.createCoreLibStringIdentifier("checker"));
checkerBuilder.set("handler", ({ args: [theFunction], accumulator, }) => checker.createChecker({
    theFunction,
    options: accumulator.options,
}));
function useCheckerBuilder(params) {
    return checkerBuilder.use({
        options: undefined,
        ...params,
    });
}

exports.checkerBuilder = checkerBuilder;
exports.useCheckerBuilder = useCheckerBuilder;
