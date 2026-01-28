import { createBuilder } from '@duplojs/utils';
import { createCoreLibStringIdentifier } from '../../stringIdentifier.mjs';

const preflightBuilder = createBuilder(createCoreLibStringIdentifier("preflight"));
function usePreflightBuilder(options) {
    return preflightBuilder.use({
        preflightSteps: [],
        hooks: options?.hooks ?? [],
        metadata: options?.metadata ?? [],
    });
}

export { preflightBuilder, usePreflightBuilder };
