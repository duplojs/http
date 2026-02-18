import { aggregateStepContract } from './aggregateStepContract.mjs';
import { E, unwrap, pipe, S, A, DP, P, O, innerPipe } from '@duplojs/utils';
import { IgnoreByCodeGeneratorMetadata } from './metadata.mjs';
import '../../core/request/index.mjs';
import { factory } from 'typescript';
import { FormDataBodyController } from '../../core/request/bodyController/formData.mjs';

const bodyAsFormData = (dataParser, { transformer, success, addImport }) => {
    const result = transformer(dataParser);
    if (E.isLeft(result)) {
        return result;
    }
    addImport("@duplojs/utils", "TheFormData");
    return success(factory.createTypeReferenceNode("TheFormData", [unwrap(result)]));
};
const convertRoutePath = (path) => pipe(path, S.split("*"), A.flatMap((element, { index, self }) => A.isLastIndex(self, index)
    ? element
    : [element, DP.string()]), P.when(A.minElements(2), (template) => DP.templateLiteral(template)), P.otherwise(() => DP.literal(path)));
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
        path: convertRoutePath(path),
        ...entrypointContract,
        ...(entrypointContract.body && FormDataBodyController.is(route.definition.bodyController)
            ? {
                body: entrypointContract
                    .body
                    .addOverrideTypescriptTransformer(bodyAsFormData),
            }
            : {}),
        responses: DP.union(endpointContract),
    })));
}

export { bodyAsFormData, convertRoutePath, routeToDataParser };
