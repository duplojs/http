import '../../steps/index.mjs';
import { processBuilder } from './builder.mjs';
import { createProcessStep } from '../../steps/process.mjs';

processBuilder.set("exec", ({ args: [process, params, ...metadata], accumulator, next, }) => next({
    ...accumulator,
    steps: [
        ...accumulator.steps,
        createProcessStep({
            ...params,
            process,
            metadata,
        }),
    ],
}));
