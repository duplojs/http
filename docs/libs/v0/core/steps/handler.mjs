import { createCoreLibKind } from '../kind.mjs';
import { pipe } from '@duplojs/utils';
import { stepKind } from './kind.mjs';

const handlerStepKind = createCoreLibKind("handler-step");
function createHandlerStep(definition) {
    return pipe({ definition }, handlerStepKind.setTo, stepKind.setTo);
}

export { createHandlerStep, handlerStepKind };
