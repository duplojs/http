'use strict';

require('../hub/index.cjs');
var utils = require('@duplojs/utils');
var pathToRegExp = require('./pathToRegExp.cjs');
var buildError = require('./buildError.cjs');
var notFoundBodyReaderImplementationError = require('./notFoundBodyReaderImplementationError.cjs');
require('../functionsBuilders/index.cjs');
var createRouterElementSystem = require('./createRouterElementSystem.cjs');
require('./types/index.cjs');
var index = require('../functionsBuilders/route/default/index.cjs');
var checkerStep = require('../functionsBuilders/steps/defaults/checkerStep.cjs');
var cutStep = require('../functionsBuilders/steps/defaults/cutStep.cjs');
var handlerStep = require('../functionsBuilders/steps/defaults/handlerStep.cjs');
var extractStep = require('../functionsBuilders/steps/defaults/extractStep.cjs');
var processStep = require('../functionsBuilders/steps/defaults/processStep.cjs');
var hooks = require('../hub/hooks.cjs');
var build = require('../functionsBuilders/route/build.cjs');
var build$1 = require('../functionsBuilders/router/build.cjs');
var index$1 = require('../functionsBuilders/router/default/index.cjs');

async function createRouter(hub) {
    const { environment } = hub.config;
    const { hooksRouteLifeCycle, routes, hooksHubLifeCycle, bodyReaderImplementations, } = hub;
    const routeFunctionBuilders = [
        ...hub.routeFunctionBuilders,
        index.defaultRouteFunctionBuilder,
    ];
    const stepFunctionBuilders = [
        ...hub.stepFunctionBuilders,
        checkerStep.defaultCheckerStepFunctionBuilder,
        cutStep.defaultCutStepFunctionBuilder,
        handlerStep.defaultHandlerStepFunctionBuilder,
        extractStep.defaultExtractStepFunctionBuilder,
        processStep.defaultProcessStepFunctionBuilder,
    ];
    const hooksBeforeBuildRoute = utils.pipe(hooksHubLifeCycle, utils.A.map(({ beforeBuildRoute }) => beforeBuildRoute), utils.A.filter(utils.isType("function")));
    const buildParams = {
        environment,
        globalHooksRouteLifeCycle: hooksRouteLifeCycle,
        stepFunctionBuilders,
        routeFunctionBuilders,
        defaultExtractContract: hub.defaultExtractContract,
    };
    const routerElementWrapper = await utils.G.asyncReduce(routes, utils.G.reduceFrom({}), async ({ lastValue, element: route, nextWithObject, }) => {
        const routeAfterHook = await hooks.launchHookBeforeBuildRoute(hooksBeforeBuildRoute, route);
        const buildedRoute = await build.buildRouteFunction(routeAfterHook, buildParams);
        if (utils.E.isLeft(buildedRoute)) {
            throw new buildError.RouterBuildError(route, utils.unwrap(buildedRoute));
        }
        const routeBodyController = route.definition.bodyController ?? hub.defaultBodyController;
        const bodyReader = utils.pipe(bodyReaderImplementations, utils.A.reduce(utils.A.reduceFrom(null), ({ element, next, exit }) => utils.pipe(element, routeBodyController.tryToCreateReader, utils.E.whenIsRight(exit), utils.E.whenIsLeft(utils.justReturn(next(null))))));
        if (!bodyReader) {
            throw new notFoundBodyReaderImplementationError.NotFoundBodyReaderImplementationError(route, routeBodyController);
        }
        return nextWithObject(lastValue, {
            [route.definition.method]: utils.A.concat(lastValue[route.definition.method] ?? [], utils.A.map(route.definition.paths, utils.O.to({
                pattern: pathToRegExp.pathToRegExp,
                buildedRoute: utils.justReturn(utils.unwrap(buildedRoute)),
                matchedPath: utils.forward,
                bodyReader: utils.justReturn(bodyReader),
            }))),
        });
    });
    const notfoundRouterElement = await createRouterElementSystem.createRouterElementSystem({
        handlerStep: hub.notfoundHandler,
        buildParams,
    });
    const malformedUrlRouterElement = await createRouterElementSystem.createRouterElementSystem({
        handlerStep: hub.malformedUrlHandler,
        buildParams,
    });
    return {
        exec: await build$1.buildRouterFunction({
            environment: hub.config.environment,
            routerElementWrapper,
            notfoundRouterElement: notfoundRouterElement,
            malformedUrlRouterElement: malformedUrlRouterElement,
            classRequest: hub.classRequest,
            routerFunctionBuilder: hub.routerFunctionBuilder ?? index$1.defaultRouterFunctionBuilder,
        }),
        hooksRouteLifeCycle,
        routeFunctionBuilders,
        routes,
        stepFunctionBuilders,
        hooksHubLifeCycle,
    };
}

exports.pathToRegExp = pathToRegExp.pathToRegExp;
exports.RouterBuildError = buildError.RouterBuildError;
exports.NotFoundBodyReaderImplementationError = notFoundBodyReaderImplementationError.NotFoundBodyReaderImplementationError;
exports.createRouterElementSystem = createRouterElementSystem.createRouterElementSystem;
exports.createRouter = createRouter;
