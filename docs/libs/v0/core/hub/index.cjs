'use strict';

var kind = require('../kind.cjs');
var index = require('../route/index.cjs');
var utils = require('@duplojs/utils');
require('../steps/index.cjs');
var request = require('../request.cjs');
var defaultNotfoundHandler = require('./defaultNotfoundHandler.cjs');
var defaultExtractContract = require('./defaultExtractContract.cjs');
var hooks = require('./hooks.cjs');
var handler = require('../steps/handler.cjs');

const hubKind = kind.createCoreLibKind("hub");
function createHub(config) {
    return {
        ...hubKind.addTo({}),
        config,
        plugins: [],
        hooksHubLifeCycle: [],
        hooksRouteLifeCycle: [],
        routeFunctionBuilders: [],
        routes: [],
        stepFunctionBuilders: [],
        notfoundHandler: defaultNotfoundHandler.defaultNotfoundHandler,
        defaultExtractContract: defaultExtractContract.defaultExtractContract,
        classRequest: request.Request,
        addHubHooks(hook) {
            return {
                ...this,
                hooksHubLifeCycle: utils.A.concat(this.hooksHubLifeCycle, utils.A.coalescing(hook)),
            };
        },
        addRouteFunctionBuilder(functionBuilder) {
            return {
                ...this,
                routeFunctionBuilders: utils.A.concat(this.routeFunctionBuilders, utils.A.coalescing(functionBuilder)),
            };
        },
        addRouteHooks(hook) {
            return {
                ...this,
                hooksRouteLifeCycle: utils.A.concat(this.hooksRouteLifeCycle, utils.A.coalescing(hook)),
            };
        },
        addStepFunctionBuilder(hook) {
            return {
                ...this,
                stepFunctionBuilders: utils.A.concat(this.stepFunctionBuilders, utils.A.coalescing(hook)),
            };
        },
        plug(plugin) {
            return {
                ...this,
                plugins: utils.A.push(this.plugins, typeof plugin === "function"
                    ? plugin(this)
                    : plugin),
            };
        },
        register(route) {
            return {
                ...this,
                routes: utils.A.concat(this.routes, utils.pipe(route, utils.P.when(index.routeKind.has, utils.A.coalescing), utils.P.when(utils.isType("iterable"), utils.A.from), utils.P.otherwise(utils.O.values), utils.A.filter((route) => !utils.A.includes(this.routes, route)))),
            };
        },
        setDefaultExtractContract(defaultExtractContract) {
            return {
                ...this,
                defaultExtractContract,
            };
        },
        setNotfoundHandler(responseContract, theFunction) {
            return {
                ...this,
                notfoundHandler: handler.createHandlerStep({
                    responseContract,
                    theFunction: (floor, params) => theFunction(params),
                    metadata: [],
                }),
            };
        },
        aggregates() {
            return utils.A.reduce(this.plugins, utils.A.reduceFrom({
                hooksRouteLifeCycle: this.hooksRouteLifeCycle,
                routeFunctionBuilders: this.routeFunctionBuilders,
                stepFunctionBuilders: this.stepFunctionBuilders,
                routes: this.routes,
                hooksHubLifeCycle: this.hooksHubLifeCycle,
            }), ({ lastValue, element: plugin, next, }) => next({
                hooksRouteLifeCycle: plugin.hooksRouteLifeCycle
                    ? utils.A.concat(lastValue.hooksRouteLifeCycle, plugin.hooksRouteLifeCycle)
                    : lastValue.hooksRouteLifeCycle,
                routeFunctionBuilders: plugin.routeFunctionBuilders
                    ? utils.A.concat(lastValue.routeFunctionBuilders, plugin.routeFunctionBuilders)
                    : lastValue.routeFunctionBuilders,
                stepFunctionBuilders: plugin.stepFunctionBuilders
                    ? utils.A.concat(lastValue.stepFunctionBuilders, plugin.stepFunctionBuilders)
                    : lastValue.stepFunctionBuilders,
                routes: plugin.routes
                    ? utils.A.concat(lastValue.routes, plugin.routes)
                    : lastValue.routes,
                hooksHubLifeCycle: plugin.hooksHubLifeCycle
                    ? utils.A.concat(lastValue.hooksHubLifeCycle, plugin.hooksHubLifeCycle)
                    : lastValue.hooksHubLifeCycle,
            }));
        },
        aggregatesRoutes() {
            return utils.A.reduce(this.plugins, utils.A.reduceFrom(this.routes), ({ lastValue, element: { routes }, next, }) => routes
                ? next(utils.A.concat(lastValue, routes))
                : next(lastValue));
        },
        aggregatesRouteFunctionBuilders() {
            return utils.A.reduce(this.plugins, utils.A.reduceFrom(this.routeFunctionBuilders), ({ lastValue, element: { routeFunctionBuilders }, next, }) => routeFunctionBuilders
                ? next(utils.A.concat(lastValue, routeFunctionBuilders))
                : next(lastValue));
        },
        aggregatesStepFunctionBuilders() {
            return utils.A.reduce(this.plugins, utils.A.reduceFrom(this.stepFunctionBuilders), ({ lastValue, element: { stepFunctionBuilders }, next, }) => stepFunctionBuilders
                ? next(utils.A.concat(lastValue, stepFunctionBuilders))
                : next(lastValue));
        },
        aggregatesHooksHubLifeCycle(hookName) {
            const hooks = utils.A.flatMap(this.hooksHubLifeCycle, (hooks) => hooks[hookName] ?? []);
            return utils.A.reduce(this.plugins, utils.A.reduceFrom(hooks), ({ lastValue, element: { hooksHubLifeCycle }, next, }) => {
                if (!hooksHubLifeCycle) {
                    return next(lastValue);
                }
                return next(utils.A.concat(lastValue, utils.A.flatMap(hooksHubLifeCycle, (hooks) => hooks[hookName] ?? [])));
            });
        },
        aggregatesHooksRouteLifeCycle(hookName) {
            const hooks = utils.A.flatMap(this.hooksRouteLifeCycle, (hooks) => hooks[hookName] ?? []);
            return utils.A.reduce(this.plugins, utils.A.reduceFrom(hooks), ({ lastValue, element: { hooksRouteLifeCycle }, next, }) => {
                if (!hooksRouteLifeCycle) {
                    return next(lastValue);
                }
                return next(utils.A.concat(lastValue, utils.A.flatMap(hooksRouteLifeCycle, (hooks) => hooks[hookName] ?? [])));
            });
        },
    };
}

exports.defaultNotfoundHandler = defaultNotfoundHandler.defaultNotfoundHandler;
exports.defaultExtractContract = defaultExtractContract.defaultExtractContract;
exports.createHookHubLifeCycle = hooks.createHookHubLifeCycle;
exports.hookServerExitKind = hooks.hookServerExitKind;
exports.hookServerNextKind = hooks.hookServerNextKind;
exports.launchHookBeforeBuildRoute = hooks.launchHookBeforeBuildRoute;
exports.launchHookServer = hooks.launchHookServer;
exports.launchHookServerError = hooks.launchHookServerError;
exports.serverErrorExitHookFunction = hooks.serverErrorExitHookFunction;
exports.serverErrorNextHookFunction = hooks.serverErrorNextHookFunction;
exports.createHub = createHub;
exports.hubKind = hubKind;
