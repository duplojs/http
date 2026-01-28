'use strict';

var kind = require('../kind.cjs');
var utils = require('@duplojs/utils');
var kind$1 = require('./kind.cjs');

const checkerStepKind = kind.createCoreLibKind("checker-step");
function createCheckerStep(definition) {
    return utils.pipe({ definition }, checkerStepKind.setTo, kind$1.stepKind.setTo);
}

exports.checkerStepKind = checkerStepKind;
exports.createCheckerStep = createCheckerStep;
