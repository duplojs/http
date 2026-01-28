import { createChecker } from '../checker.mjs';
import { createCoreLibStringIdentifier } from '../stringIdentifier.mjs';
import { createBuilder } from '@duplojs/utils';

const checkerBuilder = createBuilder(createCoreLibStringIdentifier("checker"));
checkerBuilder.set("handler", ({ args: [theFunction], accumulator, }) => createChecker({
    theFunction,
    options: accumulator.options,
}));
function useCheckerBuilder(params) {
    return checkerBuilder.use({
        options: undefined,
        ...params,
    });
}

export { checkerBuilder, useCheckerBuilder };
