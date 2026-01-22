import '../../steps/index.mjs';
import { routeBuilderHandler } from './builder.mjs';
import { createCheckerStep } from '../../steps/checker.mjs';

routeBuilderHandler.set("check", ({ args: [checker, { otherwise: responseContract, ...params }, ...metadata], accumulator, next, }) => next({
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
