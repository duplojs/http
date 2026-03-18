'use strict';

var kind = require('../kind.cjs');
var index$1 = require('../route/index.cjs');
var utils = require('@duplojs/utils');
require('../steps/index.cjs');
var index = require('../request/index.cjs');
var defaultNotfoundHandler = require('./defaultNotfoundHandler.cjs');
var defaultExtractContract = require('./defaultExtractContract.cjs');
var defaultBodyController = require('./defaultBodyController.cjs');
var defaultMalformedUrlHandler = require('./defaultMalformedUrlHandler.cjs');
var defaultEmptyReaderImplementation = require('./defaultEmptyReaderImplementation.cjs');
var hooks = require('./hooks.cjs');
var handler = require('../steps/handler.cjs');

const hubKind = kind.createCoreLibKind("hub");
class Hub extends utils.kindHeritage("hub", kind.createCoreLibKind("hub")) {
    config;
    plugins = [];
    hooksRouteLifeCycle = [];
    hooksHubLifeCycle = [];
    routes = new Set();
    routeFunctionBuilders = [];
    stepFunctionBuilders = [];
    bodyReaderImplementations = [defaultEmptyReaderImplementation.defaultEmptyReaderImplementation];
    classRequest = index.Request;
    notfoundHandler = defaultNotfoundHandler.defaultNotfoundHandler;
    defaultExtractContract = defaultExtractContract.defaultExtractContract;
    defaultBodyController = defaultBodyController.defaultBodyController;
    malformedUrlHandler = defaultMalformedUrlHandler.defaultMalformedUrlHandler;
    constructor(config) {
        super({});
        this.config = config;
    }
    register(routes) {
        utils.pipe(routes, utils.P.when(index$1.routeKind.has, utils.A.coalescing), utils.P.when(utils.isType("iterable"), utils.A.from), utils.P.otherwise(utils.O.values), utils.A.map((route) => this.routes.add(route)));
        return this;
    }
    addRouteFunctionBuilder(functionBuilder) {
        this.routeFunctionBuilders.push(...utils.A.coalescing(functionBuilder));
        return this;
    }
    addStepFunctionBuilder(functionBuilder) {
        this.stepFunctionBuilders.push(...utils.A.coalescing(functionBuilder));
        return this;
    }
    addRouteHooks(hook) {
        this.hooksRouteLifeCycle.push(...utils.A.coalescing(hook));
        return this;
    }
    addHubHooks(hook) {
        this.hooksHubLifeCycle.push(...utils.A.coalescing(hook));
        return this;
    }
    addBodyReaderImplementation(bodyReaderImplementation) {
        this.bodyReaderImplementations.push(...utils.A.coalescing(bodyReaderImplementation));
        return this;
    }
    plug(plugin) {
        const pluginResult = typeof plugin === "function"
            ? plugin(this)
            : plugin;
        if (pluginResult.bodyReaderImplementations) {
            this.addBodyReaderImplementation(pluginResult.bodyReaderImplementations);
        }
        if (pluginResult.hooksHubLifeCycle) {
            this.addHubHooks(pluginResult.hooksHubLifeCycle);
        }
        if (pluginResult.hooksRouteLifeCycle) {
            this.addRouteHooks(pluginResult.hooksRouteLifeCycle);
        }
        if (pluginResult.routeFunctionBuilders) {
            this.addRouteFunctionBuilder(pluginResult.routeFunctionBuilders);
        }
        if (pluginResult.routes) {
            this.register(pluginResult.routes);
        }
        if (pluginResult.stepFunctionBuilders) {
            this.addStepFunctionBuilder(pluginResult.stepFunctionBuilders);
        }
        this.plugins.push(pluginResult);
        return this;
    }
    setNotfoundHandler(responseContract, theFunction) {
        this.notfoundHandler = handler.createHandlerStep({
            responseContract,
            theFunction: (floor, params) => theFunction(params),
            metadata: [],
        });
        return this;
    }
    setDefaultExtractContract(responseContract) {
        this.defaultExtractContract = responseContract;
        return this;
    }
    aggregatesHooksHubLifeCycle(hookName) {
        return utils.A.flatMap(this.hooksHubLifeCycle, (hooks) => hooks[hookName] ?? []);
    }
    setDefaultBodyController(bodyController) {
        this.defaultBodyController = bodyController;
        return this;
    }
    aggregatesHooksRouteLifeCycle(hookName) {
        return utils.A.flatMap(this.hooksRouteLifeCycle, (hooks) => hooks[hookName] ?? []);
    }
    setMalformedUrlHandler(responseContract, theFunction) {
        this.malformedUrlHandler = handler.createHandlerStep({
            responseContract,
            theFunction: (__, params) => theFunction(params),
            metadata: [],
        });
        return this;
    }
    /**
     * @internal
     */
    static "new"(config) {
        return new Hub(config);
    }
}
function createHub(config) {
    return Hub.new(config);
}

exports.defaultNotfoundHandler = defaultNotfoundHandler.defaultNotfoundHandler;
exports.defaultExtractContract = defaultExtractContract.defaultExtractContract;
exports.defaultBodyController = defaultBodyController.defaultBodyController;
exports.defaultMalformedUrlHandler = defaultMalformedUrlHandler.defaultMalformedUrlHandler;
exports.defaultEmptyReaderImplementation = defaultEmptyReaderImplementation.defaultEmptyReaderImplementation;
exports.createHookHubLifeCycle = hooks.createHookHubLifeCycle;
exports.hookServerExitKind = hooks.hookServerExitKind;
exports.hookServerNextKind = hooks.hookServerNextKind;
exports.launchHookBeforeBuildRoute = hooks.launchHookBeforeBuildRoute;
exports.launchHookServer = hooks.launchHookServer;
exports.launchHookServerError = hooks.launchHookServerError;
exports.serverErrorExitHookFunction = hooks.serverErrorExitHookFunction;
exports.serverErrorNextHookFunction = hooks.serverErrorNextHookFunction;
exports.Hub = Hub;
exports.createHub = createHub;
exports.hubKind = hubKind;
