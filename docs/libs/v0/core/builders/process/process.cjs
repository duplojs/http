'use strict';

require('../../steps/index.cjs');
var builder = require('./builder.cjs');
var process = require('../../steps/process.cjs');

builder.processBuilder.set("exec", ({ args: [process$1, params, ...metadata], accumulator, next, }) => next({
    ...accumulator,
    steps: [
        ...accumulator.steps,
        process.createProcessStep({
            ...params,
            process: process$1,
            metadata,
        }),
    ],
}));
