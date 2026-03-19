import { asyncPipe, E, unwrap } from '@duplojs/utils';
import '../functionsBuilders/index.mjs';
import '../request/index.mjs';
import { createRoute } from '../route/index.mjs';
import { RouterBuildError } from './buildError.mjs';
import '../hub/index.mjs';
import { controlBodyAsEmpty } from '../request/bodyController/empty.mjs';
import { defaultEmptyReaderImplementation } from '../hub/defaultEmptyReaderImplementation.mjs';
import { buildRouteFunction } from '../functionsBuilders/route/build.mjs';

async function createRouterElementSystem(params) {
    const bodyController = controlBodyAsEmpty();
    const bodyReader = bodyController.createReaderOrThrow(defaultEmptyReaderImplementation);
    const route = createRoute({
        method: "GET",
        paths: ["/"],
        hooks: [],
        preflightSteps: [],
        steps: [params.handlerStep],
        metadata: [],
        bodyController,
    });
    const buildedRoute = await asyncPipe(buildRouteFunction(route, params.buildParams), E.whenIsLeft((element) => {
        throw new RouterBuildError(route, element);
    }), unwrap);
    return {
        bodyReader,
        buildedRoute,
    };
}

export { createRouterElementSystem };
