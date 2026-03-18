import '../hub/index.mjs';
import { pipe, A, isType, G, E, unwrap, justReturn, O, forward } from '@duplojs/utils';
import { pathToRegExp } from './pathToRegExp.mjs';
import { RouterBuildError } from './buildError.mjs';
import '../functionsBuilders/route/index.mjs';
import { decodeUrl } from './decodeUrl.mjs';
export { regexQueryAnalyser, regexUrlAnalyser } from './decodeUrl.mjs';
import { NotFoundBodyReaderImplementationError } from './notFoundBodyReaderImplementationError.mjs';
import '../functionsBuilders/index.mjs';
import { buildSystemRoute } from './buildSystemRoute.mjs';
import './types/index.mjs';
import { defaultRouteFunctionBuilder } from '../functionsBuilders/route/default.mjs';
import { defaultCheckerStepFunctionBuilder } from '../functionsBuilders/steps/defaults/checkerStep.mjs';
import { defaultCutStepFunctionBuilder } from '../functionsBuilders/steps/defaults/cutStep.mjs';
import { defaultHandlerStepFunctionBuilder } from '../functionsBuilders/steps/defaults/handlerStep.mjs';
import { defaultExtractStepFunctionBuilder } from '../functionsBuilders/steps/defaults/extractStep.mjs';
import { defaultProcessStepFunctionBuilder } from '../functionsBuilders/steps/defaults/processStep.mjs';
import { launchHookBeforeBuildRoute } from '../hub/hooks.mjs';
import { buildRouteFunction } from '../functionsBuilders/route/build.mjs';

async function buildRouter(hub) {
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
    const groupedRoute = await G.asyncReduce(routes, G.reduceFrom({}), async ({ lastValue, element: route, nextWithObject, }) => {
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
    const defaultNotfoundRoute = await buildSystemRoute({
        handlerStep: hub.notfoundHandler,
        buildParams,
    });
    const defaultMalformedUrlRoute = await buildSystemRoute({
        handlerStep: hub.malformedUrlHandler,
        buildParams,
    });
    const Request = hub.classRequest;
    return {
        exec: (initializationData) => {
            const routerElements = groupedRoute[initializationData.method];
            const decodedUrl = decodeUrl(initializationData.url);
            if (!decodedUrl) {
                return defaultMalformedUrlRoute.buildedRoute(new Request({
                    ...initializationData,
                    params: {},
                    path: "",
                    query: {},
                    matchedPath: null,
                    bodyReader: defaultMalformedUrlRoute.bodyReader,
                }));
            }
            if (!routerElements) {
                return defaultNotfoundRoute.buildedRoute(new Request({
                    ...initializationData,
                    ...decodedUrl,
                    params: {},
                    matchedPath: null,
                    bodyReader: defaultNotfoundRoute.bodyReader,
                }));
            }
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let index = 0; index < routerElements.length; index++) {
                const routerElement = routerElements[index];
                const result = routerElement.pattern.exec(decodedUrl.path);
                if (!result) {
                    continue;
                }
                return routerElement.buildedRoute(new Request({
                    ...initializationData,
                    ...decodedUrl,
                    params: result.groups ?? {},
                    matchedPath: routerElement.matchedPath,
                    bodyReader: routerElement.bodyReader,
                }));
            }
            return defaultNotfoundRoute.buildedRoute(new Request({
                ...initializationData,
                ...decodedUrl,
                params: {},
                matchedPath: null,
                bodyReader: defaultNotfoundRoute.bodyReader,
            }));
        },
        hooksRouteLifeCycle,
        routeFunctionBuilders,
        routes,
        stepFunctionBuilders,
        hooksHubLifeCycle,
    };
}

export { NotFoundBodyReaderImplementationError, RouterBuildError, buildRouter, buildSystemRoute, decodeUrl, pathToRegExp };
