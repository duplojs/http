import { E } from '@duplojs/utils';

function createStepFunctionBuilder(support, builder) {
    return (step, params) => support(step)
        ? builder(step, params)
        : E.left("stepNotSupport", step);
}

export { createStepFunctionBuilder };
