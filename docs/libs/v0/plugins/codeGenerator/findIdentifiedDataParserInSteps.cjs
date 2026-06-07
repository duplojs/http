'use strict';

require('../../core/steps/index.cjs');
var dataParserTools = require('@duplojs/data-parser-tools');
var utils = require('@duplojs/utils');
var extract = require('../../core/steps/extract.cjs');
var process = require('../../core/steps/process.cjs');
var presetChecker = require('../../core/steps/presetChecker.cjs');
var checker = require('../../core/steps/checker.cjs');
var cut = require('../../core/steps/cut.cjs');
var handler = require('../../core/steps/handler.cjs');

function dataParserHasIdentifier(dataParser) {
    return !!dataParser.definition.identifier;
}
function findIdentifiedDataParserInSteps(steps, params) {
    return utils.pipe(steps, utils.A.flatMap(utils.innerPipe(utils.P.when(extract.extractStepKind.has, (extractStep) => utils.pipe(extractStep.definition.shape, utils.O.values, utils.A.flatMap(utils.innerPipe(utils.whenNot(utils.DP.dataParserKind.has, utils.O.values))))), utils.P.when(process.processStepKind.has, utils.forward), utils.P.when(presetChecker.presetCheckerStepKind.has, (step) => [step.definition.presetChecker.definition.responseContract.body]), utils.P.when(utils.hasSomeKinds([
        checker.checkerStepKind,
        cut.cutStepKind,
        handler.handlerStepKind,
    ]), (step) => utils.pipe(step.definition.responseContract, utils.A.coalescing, utils.A.map(({ body }) => body))), utils.P.exhaustive)), utils.A.flatMap(utils.innerPipe(utils.P.when(process.processStepKind.has, (processStep) => findIdentifiedDataParserInSteps(processStep.definition.process.definition.steps, params)), utils.P.when(utils.DP.dataParserKind.has, (dataParser) => dataParserTools.DataParserFinder.dataParserFinder(dataParser, dataParserHasIdentifier, {
        researchers: dataParserTools.DataParserFinder.defaultResearchers,
        ignore: params.ignoreDataParser,
    })), utils.P.exhaustive)));
}

exports.dataParserHasIdentifier = dataParserHasIdentifier;
exports.findIdentifiedDataParserInSteps = findIdentifiedDataParserInSteps;
