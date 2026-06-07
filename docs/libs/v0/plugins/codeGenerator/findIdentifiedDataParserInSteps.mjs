import '../../core/steps/index.mjs';
import { DataParserFinder } from '@duplojs/data-parser-tools';
import { pipe, A, innerPipe, P, O, whenNot, DP, forward, hasSomeKinds } from '@duplojs/utils';
import { extractStepKind } from '../../core/steps/extract.mjs';
import { processStepKind } from '../../core/steps/process.mjs';
import { presetCheckerStepKind } from '../../core/steps/presetChecker.mjs';
import { checkerStepKind } from '../../core/steps/checker.mjs';
import { cutStepKind } from '../../core/steps/cut.mjs';
import { handlerStepKind } from '../../core/steps/handler.mjs';

function dataParserHasIdentifier(dataParser) {
    return !!dataParser.definition.identifier;
}
function findIdentifiedDataParserInSteps(steps, params) {
    return pipe(steps, A.flatMap(innerPipe(P.when(extractStepKind.has, (extractStep) => pipe(extractStep.definition.shape, O.values, A.flatMap(innerPipe(whenNot(DP.dataParserKind.has, O.values))))), P.when(processStepKind.has, forward), P.when(presetCheckerStepKind.has, (step) => [step.definition.presetChecker.definition.responseContract.body]), P.when(hasSomeKinds([
        checkerStepKind,
        cutStepKind,
        handlerStepKind,
    ]), (step) => pipe(step.definition.responseContract, A.coalescing, A.map(({ body }) => body))), P.exhaustive)), A.flatMap(innerPipe(P.when(processStepKind.has, (processStep) => findIdentifiedDataParserInSteps(processStep.definition.process.definition.steps, params)), P.when(DP.dataParserKind.has, (dataParser) => DataParserFinder.dataParserFinder(dataParser, dataParserHasIdentifier, {
        researchers: DataParserFinder.defaultResearchers,
        ignore: params.ignoreDataParser,
    })), P.exhaustive)));
}

export { dataParserHasIdentifier, findIdentifiedDataParserInSteps };
