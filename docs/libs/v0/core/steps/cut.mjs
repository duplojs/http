import { createCoreLibKind } from '../kind.mjs';
import { pipe } from '@duplojs/utils';
import { stepKind } from './kind.mjs';

const cutStepOutputKind = createCoreLibKind("cut-output");
const cutStepKind = createCoreLibKind("cut-step");
function createCutStep(definition) {
    return pipe({ definition }, cutStepKind.setTo, stepKind.setTo);
}

export { createCutStep, cutStepKind, cutStepOutputKind };
