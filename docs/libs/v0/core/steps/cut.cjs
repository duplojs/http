'use strict';

var kind = require('../kind.cjs');
var utils = require('@duplojs/utils');
var kind$1 = require('./kind.cjs');

const cutStepOutputKind = kind.createCoreLibKind("cut-output");
const cutStepKind = kind.createCoreLibKind("cut-step");
function createCutStep(definition) {
    return utils.pipe({ definition }, cutStepKind.setTo, kind$1.stepKind.setTo);
}

exports.createCutStep = createCutStep;
exports.cutStepKind = cutStepKind;
exports.cutStepOutputKind = cutStepOutputKind;
