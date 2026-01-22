import '../../steps/index.mjs';
import { routeBuilderHandler } from './builder.mjs';
import { createPresetCheckerStep } from '../../steps/presetChecker.mjs';

routeBuilderHandler.set("presetCheck", ({ args: [presetChecker, input, ...metadata], accumulator, next, }) => next({
    ...accumulator,
    steps: [
        ...accumulator.steps,
        createPresetCheckerStep({
            presetChecker,
            input,
            metadata,
        }),
    ],
}));
