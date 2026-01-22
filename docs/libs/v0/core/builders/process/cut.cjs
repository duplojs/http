'use strict';

require('../../steps/index.cjs');
var builder = require('./builder.cjs');
var cut = require('../../steps/cut.cjs');

builder.processBuilder.set("cut", ({ args: [responseContract, theFunction, ...metadata], accumulator, next, }) => next({
    ...accumulator,
    steps: [
        ...accumulator.steps,
        cut.createCutStep({
            responseContract,
            theFunction,
            metadata,
        }),
    ],
}));
