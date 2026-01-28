import { createCoreLibKind } from '../kind.mjs';
import { pipe } from '@duplojs/utils';
import { stepKind } from './kind.mjs';

const extractStepKind = createCoreLibKind("extract-step");
function createExtractStep(definition) {
    return pipe({ definition }, extractStepKind.setTo, stepKind.setTo);
}

export { createExtractStep, extractStepKind };
