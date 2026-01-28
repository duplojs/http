import { pipe } from '@duplojs/utils';
import { createCoreLibKind } from './kind.mjs';

const checkerOutputKind = createCoreLibKind("checker-output");
const checkerKind = createCoreLibKind("checker");
function createChecker(definition) {
    return pipe({ definition }, checkerKind.setTo);
}

export { checkerKind, checkerOutputKind, createChecker };
