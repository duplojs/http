import { aggregateStepContract } from './aggregateStepContract.mjs';
import { A, pipe, O, innerPipe, DP } from '@duplojs/utils';
import { IgnoreByCodeGeneratorMetadata } from './metadata.mjs';

function routeToDataParser(route, params) {
    const isIgnore = A.find(route.definition.metadata, IgnoreByCodeGeneratorMetadata.is);
    if (isIgnore) {
        return [];
    }
    return pipe([
        ...route.definition.preflightSteps,
        ...route.definition.steps,
    ], (steps) => aggregateStepContract(steps, {
        defaultExtractContract: params.defaultExtractContract,
    }), O.transformProperty("entrypointContract", innerPipe(O.entries, A.select(({ element: [key, value], select, skip }) => {
        if (DP.dataParserKind.has(value)) {
            return select(O.entry(key, value));
        }
        if (O.countKeys(value) > 0) {
            return select(O.entry(key, DP.object(value)));
        }
        return skip();
    }), O.fromEntries)), ({ endpointContract, entrypointContract }) => A.map(route.definition.paths, (path) => DP.object({
        method: DP.literal(route.definition.method),
        path: DP.literal(path),
        ...entrypointContract,
        responses: DP.union(endpointContract),
    })));
}

export { routeToDataParser };
