import '../hub/index.mjs';
import { pipe, A, isType, G, E, unwrap, justReturn, O, forward } from '@duplojs/utils';
import { pathToRegExp } from './pathToRegExp.mjs';
import { RouterBuildError } from './buildError.mjs';
import { NotFoundBodyReaderImplementationError } from './notFoundBodyReaderImplementationError.mjs';
import '../functionsBuilders/index.mjs';
import { createRouterElementSystem } from './createRouterElementSystem.mjs';
import './types/index.mjs';
import { defaultRouteFunctionBuilder } from '../functionsBuilders/route/default/index.mjs';
import { defaultCheckerStepFunctionBuilder } from '../functionsBuilders/steps/defaults/checkerStep.mjs';
import { defaultCutStepFunctionBuilder } from '../functionsBuilders/steps/defaults/cutStep.mjs';
import { defaultHandlerStepFunctionBuilder } from '../functionsBuilders/steps/defaults/handlerStep.mjs';
import { defaultExtractStepFunctionBuilder } from '../functionsBuilders/steps/defaults/extractStep.mjs';
import { defaultProcessStepFunctionBuilder } from '../functionsBuilders/steps/defaults/processStep.mjs';
import { launchHookBeforeBuildRoute } from '../hub/hooks.mjs';
import { buildRouteFunction } from '../functionsBuilders/route/build.mjs';
import { buildRouterFunction } from '../functionsBuilders/router/build.mjs';
import { defaultRouterFunctionBuilder } from '../functionsBuilders/router/default/index.mjs';

async function createRouter(hub) {
    const { environment } = hub.config;
    const { hooksRouteLifeCycle, routes, hooksHubLifeCycle, bodyReaderImplementations, } = hub;
    const routeFunctionBuilders = [
        ...hub.routeFunctionBuilders,
        defaultRouteFunctionBuilder,
    ];
    const stepFunctionBuilders = [
        ...hub.stepFunctionBuilders,
        defaultCheckerStepFunctionBuilder,
        defaultCutStepFunctionBuilder,
        defaultHandlerStepFunctionBuilder,
        defaultExtractStepFunctionBuilder,
        defaultProcessStepFunctionBuilder,
    ];
    const hooksBeforeBuildRoute = pipe(hooksHubLifeCycle, A.map(({ beforeBuildRoute }) => beforeBuildRoute), A.filter(isType("function")));
    const buildParams = {
        environment,
        globalHooksRouteLifeCycle: hooksRouteLifeCycle,
        stepFunctionBuilders,
        routeFunctionBuilders,
        defaultExtractContract: hub.defaultExtractContract,
    };
    const routerElementWrapper = await G.asyncReduce(routes, G.reduceFrom({}), async ({ lastValue, element: route, nextWithObject, }) => {
        const routeAfterHook = await launchHookBeforeBuildRoute(hooksBeforeBuildRoute, route);
        const buildedRoute = await buildRouteFunction(routeAfterHook, buildParams);
        if (E.isLeft(buildedRoute)) {
            throw new RouterBuildError(route, unwrap(buildedRoute));
        }
        const routeBodyController = route.definition.bodyController ?? hub.defaultBodyController;
        const bodyReader = pipe(bodyReaderImplementations, A.reduce(A.reduceFrom(null), ({ element, next, exit }) => pipe(element, routeBodyController.tryToCreateReader, E.whenIsRight(exit), E.whenIsLeft(justReturn(next(null))))));
        if (!bodyReader) {
            throw new NotFoundBodyReaderImplementationError(route, routeBodyController);
        }
        return nextWithObject(lastValue, {
            [route.definition.method]: A.concat(lastValue[route.definition.method] ?? [], A.map(route.definition.paths, O.to({
                pattern: pathToRegExp,
                buildedRoute: justReturn(unwrap(buildedRoute)),
                matchedPath: forward,
                bodyReader: justReturn(bodyReader),
            }))),
        });
    });
    const notfoundRouterElement = await createRouterElementSystem({
        handlerStep: hub.notfoundHandler,
        buildParams,
    });
    const malformedUrlRouterElement = await createRouterElementSystem({
        handlerStep: hub.malformedUrlHandler,
        buildParams,
    });
    return {
        exec: await buildRouterFunction({
            environment: hub.config.environment,
            routerElementWrapper,
            notfoundRouterElement: notfoundRouterElement,
            malformedUrlRouterElement: malformedUrlRouterElement,
            classRequest: hub.classRequest,
            routerFunctionBuilder: hub.routerFunctionBuilder ?? defaultRouterFunctionBuilder,
        }),
        hooksRouteLifeCycle,
        routeFunctionBuilders,
        routes,
        stepFunctionBuilders,
        hooksHubLifeCycle,
    };
}

export { NotFoundBodyReaderImplementationError, RouterBuildError, createRouter, createRouterElementSystem, pathToRegExp };
