'use strict';

var aggregateStepContract = require('./aggregateStepContract.cjs');
var utils = require('@duplojs/utils');
var metadata = require('./metadata.cjs');

function routeToDataParser(route, params) {
    const isIgnore = utils.A.find(route.definition.metadata, metadata.IgnoreByCodeGeneratorMetadata.is);
    if (isIgnore) {
        return [];
    }
    return utils.pipe([
        ...route.definition.preflightSteps,
        ...route.definition.steps,
    ], (steps) => aggregateStepContract.aggregateStepContract(steps, {
        defaultExtractContract: params.defaultExtractContract,
    }), utils.O.transformProperty("entrypointContract", utils.innerPipe(utils.O.entries, utils.A.select(({ element: [key, value], select, skip }) => {
        if (utils.DP.dataParserKind.has(value)) {
            return select(utils.O.entry(key, value));
        }
        if (utils.O.countKeys(value) > 0) {
            return select(utils.O.entry(key, utils.DP.object(value)));
        }
        return skip();
    }), utils.O.fromEntries)), ({ endpointContract, entrypointContract }) => utils.A.map(route.definition.paths, (path) => utils.DP.object({
        method: utils.DP.literal(route.definition.method),
        path: utils.DP.literal(path),
        ...entrypointContract,
        responses: utils.DP.union(endpointContract),
    })));
}

exports.routeToDataParser = routeToDataParser;
