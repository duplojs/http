'use strict';

var utils = require('@duplojs/utils');

function createStepFunctionBuilder(support, builder) {
    return (step, params) => support(step)
        ? builder(step, params)
        : utils.E.left("stepNotSupport", step);
}

exports.createStepFunctionBuilder = createStepFunctionBuilder;
