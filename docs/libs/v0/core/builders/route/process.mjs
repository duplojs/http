import '../../steps/index.mjs';
import { routeBuilderHandler } from './builder.mjs';
import { createProcessStep } from '../../steps/process.mjs';

routeBuilderHandler.set("exec", ({ args: [process, params, ...metadata], accumulator, next, }) => next({
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
