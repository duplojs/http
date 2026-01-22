'use strict';

var kind = require('../kind.cjs');
var utils = require('@duplojs/utils');
var kind$1 = require('./kind.cjs');

const handlerStepKind = kind.createCoreLibKind("handler-step");
function createHandlerStep(definition) {
    return utils.pipe({ definition }, handlerStepKind.setTo, kind$1.stepKind.setTo);
}

exports.createHandlerStep = createHandlerStep;
exports.handlerStepKind = handlerStepKind;
