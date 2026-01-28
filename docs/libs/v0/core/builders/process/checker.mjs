import '../../steps/index.mjs';
import { processBuilder } from './builder.mjs';
import { createCheckerStep } from '../../steps/checker.mjs';

processBuilder.set("check", ({ args: [checker, { otherwise: responseContract, ...params }, ...metadata], accumulator, next, }) => next({
    ...accumulator,
    steps: [
        ...accumulator.steps,
        createCheckerStep({
            ...params,
            responseContract,
            checker,
            metadata,
        }),
    ],
}));
