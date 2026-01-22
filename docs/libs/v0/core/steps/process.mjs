import { createCoreLibKind } from '../kind.mjs';
import { pipe } from '@duplojs/utils';
import { stepKind } from './kind.mjs';

const processStepKind = createCoreLibKind("process-step");
function createProcessStep(definition) {
    return pipe({ definition }, processStepKind.setTo, stepKind.setTo);
}

export { createProcessStep, processStepKind };
