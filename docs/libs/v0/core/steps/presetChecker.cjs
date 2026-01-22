'use strict';

var kind = require('../kind.cjs');
var utils = require('@duplojs/utils');
var kind$1 = require('./kind.cjs');

const presetCheckerStepKind = kind.createCoreLibKind("presetChecker-step");
function createPresetCheckerStep(definition) {
    return utils.pipe({ definition }, presetCheckerStepKind.setTo, kind$1.stepKind.setTo);
}

exports.createPresetCheckerStep = createPresetCheckerStep;
exports.presetCheckerStepKind = presetCheckerStepKind;
