'use strict';

var aggregateStepContract = require('./aggregateStepContract.cjs');
var utils = require('@duplojs/utils');
var metadata = require('./metadata.cjs');
require('../../core/request/index.cjs');
var typescript = require('typescript');
var formData = require('../../core/request/bodyController/formData.cjs');

const bodyAsFormData = (dataParser, { transformer, success, addImport }) => {
    const result = transformer(dataParser);
    if (utils.E.isLeft(result)) {
        return result;
    }
    addImport("@duplojs/utils", "TheFormData");
    return success(typescript.factory.createTypeReferenceNode("TheFormData", [utils.unwrap(result)]));
};
const convertRoutePath = (path) => utils.pipe(path, utils.S.split("*"), utils.A.flatMap((element, { index, self }) => utils.A.isLastIndex(self, index)
    ? element
    : [element, utils.DP.string()]), utils.P.when(utils.A.minElements(2), (template) => utils.DP.templateLiteral(template)), utils.P.otherwise(() => utils.DP.literal(path)));
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
        path: convertRoutePath(path),
        ...entrypointContract,
        ...(entrypointContract.body && formData.FormDataBodyController.is(route.definition.bodyController)
            ? {
                body: entrypointContract
                    .body
                    .addOverrideTypescriptTransformer(bodyAsFormData),
            }
            : {}),
        responses: utils.DP.union(endpointContract),
    })));
}

exports.bodyAsFormData = bodyAsFormData;
exports.convertRoutePath = convertRoutePath;
exports.routeToDataParser = routeToDataParser;
