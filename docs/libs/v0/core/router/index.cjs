'use strict';

require('../hub/index.cjs');
var utils = require('@duplojs/utils');
var pathToRegExp = require('./pathToRegExp.cjs');
var index = require('../route/index.cjs');
var buildError = require('./buildError.cjs');
require('../functionsBuilders/route/index.cjs');
require('../functionsBuilders/steps/index.cjs');
var decodeUrl = require('./decodeUrl.cjs');
require('./types/index.cjs');
var _default = require('../functionsBuilders/route/default.cjs');
var checkerStep = require('../functionsBuilders/steps/defaults/checkerStep.cjs');
var cutStep = require('../functionsBuilders/steps/defaults/cutStep.cjs');
var handlerStep = require('../functionsBuilders/steps/defaults/handlerStep.cjs');
var extractStep = require('../functionsBuilders/steps/defaults/extractStep.cjs');
var processStep = require('../functionsBuilders/steps/defaults/processStep.cjs');
var hooks = require('../hub/hooks.cjs');
var build = require('../functionsBuilders/route/build.cjs');

async function buildRouter(inputHub) {
    const hub = inputHub
        .addRouteFunctionBuilder(_default.defaultRouteFunctionBuilder)
        .addStepFunctionBuilder([
        checkerStep.defaultCheckerStepFunctionBuilder,
        cutStep.defaultCutStepFunctionBuilder,
        handlerStep.defaultHandlerStepFunctionBuilder,
        extractStep.defaultExtractStepFunctionBuilder,
        processStep.defaultProcessStepFunctionBuilder,
    ]);
    const { environment } = hub.config;
    const { hooksRouteLifeCycle, routeFunctionBuilders, routes, stepFunctionBuilders, hooksHubLifeCycle, } = hub.aggregates();
    const hooksBeforeBuildRoute = utils.pipe(hooksHubLifeCycle, utils.A.map(({ beforeBuildRoute }) => beforeBuildRoute), utils.A.filter(utils.isType("function")));
    const buildParams = {
        environment,
        globalHooksRouteLifeCycle: hooksRouteLifeCycle,
        stepFunctionBuilders,
        routeFunctionBuilders,
        defaultExtractContract: hub.defaultExtractContract,
    };
    const groupedRoute = await utils.G.asyncReduce(routes, utils.G.reduceFrom({}), async ({ lastValue, element: route, nextWithObject, }) => {
        const routeAfterHook = await hooks.launchHookBeforeBuildRoute(hooksBeforeBuildRoute, route);
        const buildedRoute = await build.buildRouteFunction(routeAfterHook, buildParams);
        if (utils.E.isLeft(buildedRoute)) {
            throw new buildError.RouterBuildError(route, utils.unwrap(buildedRoute));
        }
        return nextWithObject(lastValue, {
            [route.definition.method]: utils.A.concat(lastValue[route.definition.method] ?? [], utils.A.map(route.definition.paths, utils.O.to({
                pattern: pathToRegExp.pathToRegExp,
                buildedRoute: utils.justReturn(utils.unwrap(buildedRoute)),
                matchedPath: utils.forward,
            }))),
        });
    });
    const buildedNotfoundRoute = await utils.asyncPipe(index.createRoute({
        method: "GET",
        paths: ["/"],
        hooks: [],
        preflightSteps: [],
        steps: [hub.notfoundHandler],
        metadata: [],
    }), async (route) => {
        const result = await build.buildRouteFunction(route, buildParams);
        return utils.E.whenIsLeft(result, (element) => {
            throw new buildError.RouterBuildError(route, element);
        });
    }, utils.unwrap);
    const Request = hub.classRequest;
    return {
        exec: (initializationData) => {
            const routerElements = groupedRoute[initializationData.method];
            const decodedUrl = decodeUrl.decodeUrl(initializationData.url);
            if (!routerElements) {
                return buildedNotfoundRoute(new Request({
                    ...initializationData,
                    ...decodedUrl,
                    params: {},
                    matchedPath: null,
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
                }));
            }
            return buildedNotfoundRoute(new Request({
                ...initializationData,
                ...decodedUrl,
                params: {},
                matchedPath: null,
            }));
        },
        hooksRouteLifeCycle,
        routeFunctionBuilders,
        routes,
        stepFunctionBuilders,
        hooksHubLifeCycle,
    };
}

exports.pathToRegExp = pathToRegExp.pathToRegExp;
exports.RouterBuildError = buildError.RouterBuildError;
exports.decodeUrl = decodeUrl.decodeUrl;
exports.regexQueryAnalyser = decodeUrl.regexQueryAnalyser;
exports.regexUrlAnalyser = decodeUrl.regexUrlAnalyser;
exports.buildRouter = buildRouter;
