'use strict';

var utils = require('@duplojs/utils');
var stringIdentifier = require('../../stringIdentifier.cjs');

const processBuilder = utils.createBuilder(stringIdentifier.createCoreLibStringIdentifier("process"));
function useProcessBuilder(params) {
    return processBuilder.use({
        options: undefined,
        ...params,
        steps: [],
        hooks: params?.hooks ?? [],
        metadata: params?.metadata ?? [],
    });
}

exports.processBuilder = processBuilder;
exports.useProcessBuilder = useProcessBuilder;
