'use strict';

require('../../steps/index.cjs');
var builder = require('./builder.cjs');
var process = require('../../steps/process.cjs');

builder.preflightBuilder.set("exec", ({ args: [process$1, params, ...metadata], accumulator, next, }) => next({
    ...accumulator,
    preflightSteps: [
        ...accumulator.preflightSteps,
        process.createProcessStep({
            ...params,
            process: process$1,
            metadata,
        }),
    ],
}));
