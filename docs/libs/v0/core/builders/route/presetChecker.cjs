'use strict';

require('../../steps/index.cjs');
var builder = require('./builder.cjs');
var presetChecker = require('../../steps/presetChecker.cjs');

builder.routeBuilderHandler.set("presetCheck", ({ args: [presetChecker$1, input, ...metadata], accumulator, next, }) => next({
    ...accumulator,
    steps: [
        ...accumulator.steps,
        presetChecker.createPresetCheckerStep({
            presetChecker: presetChecker$1,
            input,
            metadata,
        }),
    ],
}));
