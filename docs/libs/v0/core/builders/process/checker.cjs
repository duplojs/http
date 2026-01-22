'use strict';

require('../../steps/index.cjs');
var builder = require('./builder.cjs');
var checker = require('../../steps/checker.cjs');

builder.processBuilder.set("check", ({ args: [checker$1, { otherwise: responseContract, ...params }, ...metadata], accumulator, next, }) => next({
    ...accumulator,
    steps: [
        ...accumulator.steps,
        checker.createCheckerStep({
            ...params,
            responseContract,
            checker: checker$1,
            metadata,
        }),
    ],
}));
