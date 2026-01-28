import '../../steps/index.mjs';
import { processBuilder } from './builder.mjs';
import { createPresetCheckerStep } from '../../steps/presetChecker.mjs';

processBuilder.set("presetCheck", ({ args: [presetChecker, input, ...metadata], accumulator, next, }) => next({
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
