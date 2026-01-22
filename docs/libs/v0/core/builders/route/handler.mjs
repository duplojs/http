import { createRoute } from '../../route/index.mjs';
import '../../steps/index.mjs';
import { A } from '@duplojs/utils';
import { routeBuilderHandler } from './builder.mjs';
import { routeStore } from './store.mjs';
import '../../metadata/index.mjs';
import { createHandlerStep } from '../../steps/handler.mjs';
import { IgnoreByRouteStoreMetadata } from '../../metadata/ignoreByRouteStore.mjs';

routeBuilderHandler.set("handler", ({ args: [responseContract, theFunction, ...metadata], accumulator, }) => {
    const route = createRoute({
        ...accumulator,
        steps: [
            ...accumulator.steps,
            createHandlerStep({
                responseContract,
                theFunction,
                metadata,
            }),
        ],
    });
    const ignoreByRouteStoreMetadata = A.find(accumulator.metadata, IgnoreByRouteStoreMetadata.is);
    if (ignoreByRouteStoreMetadata === undefined) {
        routeStore.add(route);
    }
    return route;
});
