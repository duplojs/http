import '../../steps/index.mjs';
import { routeBuilderHandler } from './builder.mjs';
import { createCutStep } from '../../steps/cut.mjs';

routeBuilderHandler.set("cut", ({ args: [responseContract, theFunction, ...metadata], accumulator, next, }) => next({
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
