'use strict';

var kind = require('../kind.cjs');
var utils = require('@duplojs/utils');
var kind$1 = require('./kind.cjs');

const extractStepKind = kind.createCoreLibKind("extract-step");
function createExtractStep(definition) {
    return utils.pipe({ definition }, extractStepKind.setTo, kind$1.stepKind.setTo);
}

exports.createExtractStep = createExtractStep;
exports.extractStepKind = extractStepKind;
