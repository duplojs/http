import '../../steps/index.mjs';
import { processBuilder } from './builder.mjs';
import { createCutStep } from '../../steps/cut.mjs';

processBuilder.set("cut", ({ args: [responseContract, theFunction, ...metadata], accumulator, next, }) => next({
    ...accumulator,
    steps: [
        ...accumulator.steps,
        createCutStep({
            responseContract,
            theFunction,
            metadata,
        }),
    ],
}));
