import { createBuilder, A } from '@duplojs/utils';
import { createCoreLibStringIdentifier } from '../../stringIdentifier.mjs';

const routeBuilderHandler = createBuilder(createCoreLibStringIdentifier("route"));
function useRouteBuilder(method, path, options) {
    return routeBuilderHandler.use({
        method,
        paths: A.coalescing(path),
        preflightSteps: [],
        steps: [],
        hooks: options?.hooks ?? [],
        metadata: options?.metadata ?? [],
        bodyController: options?.bodyController ?? null,
    });
}

export { routeBuilderHandler, useRouteBuilder };
