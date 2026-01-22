'use strict';

require('../../steps/index.cjs');
var builder = require('./builder.cjs');
var extract = require('../../steps/extract.cjs');

builder.processBuilder.set("extract", ({ args: [shape, responseContract, ...metadata], accumulator, next, }) => next({
    ...accumulator,
    steps: [
        ...accumulator.steps,
        extract.createExtractStep({
            shape,
            responseContract,
            metadata,
        }),
    ],
}));
