import { createCoreLibKind } from '../kind.mjs';
import { pipe } from '@duplojs/utils';
import { stepKind } from './kind.mjs';

const presetCheckerStepKind = createCoreLibKind("presetChecker-step");
function createPresetCheckerStep(definition) {
    return pipe({ definition }, presetCheckerStepKind.setTo, stepKind.setTo);
}

export { createPresetCheckerStep, presetCheckerStepKind };
