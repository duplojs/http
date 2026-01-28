import '../../steps/index.mjs';
import { processBuilder } from './builder.mjs';
import { createExtractStep } from '../../steps/extract.mjs';

processBuilder.set("extract", ({ args: [shape, responseContract, ...metadata], accumulator, next, }) => next({
    ...accumulator,
    steps: [
        ...accumulator.steps,
        createExtractStep({
            shape,
            responseContract,
            metadata,
        }),
    ],
}));
