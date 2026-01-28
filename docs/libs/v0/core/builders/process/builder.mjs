import { createBuilder } from '@duplojs/utils';
import { createCoreLibStringIdentifier } from '../../stringIdentifier.mjs';

const processBuilder = createBuilder(createCoreLibStringIdentifier("process"));
function useProcessBuilder(params) {
    return processBuilder.use({
        options: undefined,
        ...params,
        steps: [],
        hooks: params?.hooks ?? [],
        metadata: params?.metadata ?? [],
    });
}

export { processBuilder, useProcessBuilder };
