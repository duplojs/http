import { pipe } from '@duplojs/utils';
import { createCoreLibKind } from '../kind.mjs';
import './types/index.mjs';

const processKind = createCoreLibKind("process");
function createProcess(definition) {
    return pipe({ definition }, processKind.setTo);
}

export { createProcess, processKind };
