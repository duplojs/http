import { createCoreLibKind } from '../kind.mjs';
import { pipe } from '@duplojs/utils';
import { stepKind } from './kind.mjs';

const checkerStepKind = createCoreLibKind("checker-step");
function createCheckerStep(definition) {
    return pipe({ definition }, checkerStepKind.setTo, stepKind.setTo);
}

export { checkerStepKind, createCheckerStep };
