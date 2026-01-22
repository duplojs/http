import '../../steps/index.mjs';
import { routeBuilderHandler } from './builder.mjs';
import { createExtractStep } from '../../steps/extract.mjs';

routeBuilderHandler.set("extract", ({ args: [shape, responseContract, ...metadata], accumulator, next, }) => next({
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
