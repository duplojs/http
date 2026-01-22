import '../../steps/index.mjs';
import { preflightBuilder } from './builder.mjs';
import { createProcessStep } from '../../steps/process.mjs';

preflightBuilder.set("exec", ({ args: [process, params, ...metadata], accumulator, next, }) => next({
    ...accumulator,
    preflightSteps: [
        ...accumulator.preflightSteps,
        createProcessStep({
            ...params,
            process,
            metadata,
        }),
    ],
}));
