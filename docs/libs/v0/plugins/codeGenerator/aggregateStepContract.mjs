import '../../core/steps/index.mjs';
import { A, pipe, O, DP, P, hasSomeKinds, innerPipe } from '@duplojs/utils';
import '../../core/response/index.mjs';
import { IgnoreByCodeGeneratorMetadata } from './metadata.mjs';
import { stepIdentifier } from '../../core/steps/identifier.mjs';
import { processStepKind } from '../../core/steps/process.mjs';
import { extractStepKind } from '../../core/steps/extract.mjs';
import { presetCheckerStepKind } from '../../core/steps/presetChecker.mjs';
import { checkerStepKind } from '../../core/steps/checker.mjs';
import { cutStepKind } from '../../core/steps/cut.mjs';
import { handlerStepKind } from '../../core/steps/handler.mjs';
import { ResponseContract } from '../../core/response/contract.mjs';

function aggregateStepContract(steps, params) {
    const filteredStep = A.filter(steps, (step) => A.find(step.definition.metadata, IgnoreByCodeGeneratorMetadata.is) === undefined);
    const processContracts = pipe(filteredStep, A.filter(stepIdentifier(processStepKind)), A.filter((step) => A.find(step.definition.process.definition.metadata, IgnoreByCodeGeneratorMetadata.is) === undefined), A.map((element) => aggregateStepContract(element.definition.process.definition.steps, params)), O.to({
        entrypointContract: A.map((result) => result.entrypointContract),
        endpointContract: A.flatMap((result) => result.endpointContract),
    }));
    const entrypointContract = pipe(filteredStep, A.filter(extractStepKind.has), A.map((extractStep) => extractStep.definition.shape), A.concat(processContracts.entrypointContract), A.reduce(A.reduceFrom({
        body: {},
        headers: {},
        params: {},
        query: {},
    }), ({ element: shape, lastValue, nextWithObject }) => pipe(lastValue, O.entries, A.map(([key, accumulatorValue]) => {
        const currentExtractDataParser = shape[key];
        if (DP.dataParserKind.has(accumulatorValue)
            || !currentExtractDataParser
            || (!DP.dataParserKind.has(accumulatorValue)
                && O.countKeys(accumulatorValue) > 1
                && DP.dataParserKind.has(currentExtractDataParser)
                && !DP.objectKind.has(currentExtractDataParser))) {
            return O.entry(key, accumulatorValue);
        }
        if (!DP.dataParserKind.has(currentExtractDataParser)) {
            return O.entry(key, {
                ...accumulatorValue,
                ...currentExtractDataParser,
            });
        }
        if (DP.identifier(currentExtractDataParser, DP.objectKind)) {
            return O.entry(key, {
                ...accumulatorValue,
                ...currentExtractDataParser.definition.shape,
            });
        }
        return O.entry(key, currentExtractDataParser);
    }), O.fromEntries, (object) => nextWithObject(lastValue, object))));
    const endpointContract = pipe(filteredStep, A.flatMap((step) => P.match(step)
        .when(processStepKind.has, () => [])
        .when(extractStepKind.has, ({ definition }) => definition.responseContract ?? params.defaultExtractContract)
        .when(presetCheckerStepKind.has, ({ definition }) => definition.presetChecker.definition.responseContract)
        .when(hasSomeKinds([
        checkerStepKind,
        cutStepKind,
        handlerStepKind,
    ]), ({ definition }) => definition.responseContract)
        .exhaustive()), A.map(innerPipe(P.when(ResponseContract.contractKind.has, ({ code, information, body }) => DP.object({
        code: DP.literal(code),
        information: DP.literal(information),
        body,
    })), P.when(ResponseContract.serverSentEventsContractKind.has, ({ code, information, body, events }) => DP.object({
        code: DP.literal(code),
        information: DP.literal(information),
        body,
        events: DP.object(events),
    })), P.exhaustive)), A.concat(processContracts.endpointContract));
    return {
        entrypointContract,
        endpointContract,
    };
}

export { aggregateStepContract };
