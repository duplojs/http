'use strict';

var utils = require('@duplojs/utils');
var stringIdentifier = require('../../stringIdentifier.cjs');

const preflightBuilder = utils.createBuilder(stringIdentifier.createCoreLibStringIdentifier("preflight"));
function usePreflightBuilder(options) {
    return preflightBuilder.use({
        preflightSteps: [],
        hooks: options?.hooks ?? [],
        metadata: options?.metadata ?? [],
    });
}

exports.preflightBuilder = preflightBuilder;
exports.usePreflightBuilder = usePreflightBuilder;
