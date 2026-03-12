'use strict';

require('../../core/steps/index.cjs');
var utils = require('@duplojs/utils');
require('../../core/response/index.cjs');
var metadata = require('./metadata.cjs');
var identifier = require('../../core/steps/identifier.cjs');
var process = require('../../core/steps/process.cjs');
var extract = require('../../core/steps/extract.cjs');
var presetChecker = require('../../core/steps/presetChecker.cjs');
var checker = require('../../core/steps/checker.cjs');
var cut = require('../../core/steps/cut.cjs');
var handler = require('../../core/steps/handler.cjs');
var contract = require('../../core/response/contract.cjs');

function aggregateStepContract(steps, params) {
    const filteredStep = utils.A.filter(steps, (step) => utils.A.find(step.definition.metadata, metadata.IgnoreByCodeGeneratorMetadata.is) === undefined);
    const processContracts = utils.pipe(filteredStep, utils.A.filter(identifier.stepIdentifier(process.processStepKind)), utils.A.filter((step) => utils.A.find(step.definition.process.definition.metadata, metadata.IgnoreByCodeGeneratorMetadata.is) === undefined), utils.A.map((element) => aggregateStepContract(element.definition.process.definition.steps, params)), utils.O.to({
        entrypointContract: utils.A.map((result) => result.entrypointContract),
        endpointContract: utils.A.flatMap((result) => result.endpointContract),
    }));
    const entrypointContract = utils.pipe(filteredStep, utils.A.filter(extract.extractStepKind.has), utils.A.map((extractStep) => extractStep.definition.shape), utils.A.concat(processContracts.entrypointContract), utils.A.reduce(utils.A.reduceFrom({
        body: {},
        headers: {},
        params: {},
        query: {},
    }), ({ element: shape, lastValue, nextWithObject }) => utils.pipe(lastValue, utils.O.entries, utils.A.map(([key, accumulatorValue]) => {
        const currentExtractDataParser = shape[key];
        if (utils.DP.dataParserKind.has(accumulatorValue)
            || !currentExtractDataParser
            || (!utils.DP.dataParserKind.has(accumulatorValue)
                && utils.O.countKeys(accumulatorValue) > 1
                && utils.DP.dataParserKind.has(currentExtractDataParser)
                && !utils.DP.objectKind.has(currentExtractDataParser))) {
            return utils.O.entry(key, accumulatorValue);
        }
        if (!utils.DP.dataParserKind.has(currentExtractDataParser)) {
            return utils.O.entry(key, {
                ...accumulatorValue,
                ...currentExtractDataParser,
            });
        }
        if (utils.DP.identifier(currentExtractDataParser, utils.DP.objectKind)) {
            return utils.O.entry(key, {
                ...accumulatorValue,
                ...currentExtractDataParser.definition.shape,
            });
        }
        return utils.O.entry(key, currentExtractDataParser);
    }), utils.O.fromEntries, (object) => nextWithObject(lastValue, object))));
    const endpointContract = utils.pipe(filteredStep, utils.A.flatMap((step) => utils.P.match(step)
        .when(process.processStepKind.has, () => [])
        .when(extract.extractStepKind.has, ({ definition }) => definition.responseContract ?? params.defaultExtractContract)
        .when(presetChecker.presetCheckerStepKind.has, ({ definition }) => definition.presetChecker.definition.responseContract)
        .when(utils.hasSomeKinds([
        checker.checkerStepKind,
        cut.cutStepKind,
        handler.handlerStepKind,
    ]), ({ definition }) => definition.responseContract)
        .exhaustive()), utils.A.map(utils.innerPipe(utils.P.when(contract.ResponseContract.contractKind.has, ({ code, information, body }) => utils.DP.object({
        code: utils.DP.literal(code),
        information: utils.DP.literal(information),
        body,
    })), utils.P.when(contract.ResponseContract.serverSentEventsContractKind.has, ({ code, information, body, events }) => utils.DP.object({
        code: utils.DP.literal(code),
        information: utils.DP.literal(information),
        body,
        events: utils.DP.object(events),
    })), utils.P.exhaustive)), utils.A.concat(processContracts.endpointContract));
    return {
        entrypointContract,
        endpointContract,
    };
}

exports.aggregateStepContract = aggregateStepContract;
