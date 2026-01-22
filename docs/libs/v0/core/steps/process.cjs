'use strict';

var kind = require('../kind.cjs');
var utils = require('@duplojs/utils');
var kind$1 = require('./kind.cjs');

const processStepKind = kind.createCoreLibKind("process-step");
function createProcessStep(definition) {
    return utils.pipe({ definition }, processStepKind.setTo, kind$1.stepKind.setTo);
}

exports.createProcessStep = createProcessStep;
exports.processStepKind = processStepKind;
