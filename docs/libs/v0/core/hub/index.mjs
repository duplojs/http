import { createCoreLibKind } from '../kind.mjs';
import { routeKind } from '../route/index.mjs';
import { kindHeritage, pipe, P, A, isType, O } from '@duplojs/utils';
import '../steps/index.mjs';
import { Request } from '../request/index.mjs';
import { defaultNotfoundHandler } from './defaultNotfoundHandler.mjs';
import { defaultExtractContract } from './defaultExtractContract.mjs';
import { defaultBodyController } from './defaultBodyController.mjs';
export { createHookHubLifeCycle, hookServerExitKind, hookServerNextKind, launchHookBeforeBuildRoute, launchHookServer, launchHookServerError, serverErrorExitHookFunction, serverErrorNextHookFunction } from './hooks.mjs';
import { createHandlerStep } from '../steps/handler.mjs';

const hubKind = createCoreLibKind("hub");
class Hub extends kindHeritage("hub", createCoreLibKind("hub")) {
    config;
    plugins = [];
    hooksRouteLifeCycle = [];
    hooksHubLifeCycle = [];
    routes = new Set();
    routeFunctionBuilders = [];
    stepFunctionBuilders = [];
    bodyReaderImplementations = [];
    classRequest = Request;
    notfoundHandler = defaultNotfoundHandler;
    defaultExtractContract = defaultExtractContract;
    defaultBodyController = defaultBodyController;
    constructor(config) {
        super({});
        this.config = config;
    }
    register(routes) {
        pipe(routes, P.when(routeKind.has, A.coalescing), P.when(isType("iterable"), A.from), P.otherwise(O.values), A.map((route) => this.routes.add(route)));
        return this;
    }
    addRouteFunctionBuilder(functionBuilder) {
        this.routeFunctionBuilders.push(...A.coalescing(functionBuilder));
        return this;
    }
    addStepFunctionBuilder(functionBuilder) {
        this.stepFunctionBuilders.push(...A.coalescing(functionBuilder));
        return this;
    }
    addRouteHooks(hook) {
        this.hooksRouteLifeCycle.push(...A.coalescing(hook));
        return this;
    }
    addHubHooks(hook) {
        this.hooksHubLifeCycle.push(...A.coalescing(hook));
        return this;
    }
    addBodyReaderImplementation(bodyReaderImplementation) {
        this.bodyReaderImplementations.push(...A.coalescing(bodyReaderImplementation));
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
        this.notfoundHandler = createHandlerStep({
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
        return A.flatMap(this.hooksHubLifeCycle, (hooks) => hooks[hookName] ?? []);
    }
    setDefaultBodyController(bodyController) {
        this.defaultBodyController = bodyController;
        return this;
    }
    aggregatesHooksRouteLifeCycle(hookName) {
        return A.flatMap(this.hooksRouteLifeCycle, (hooks) => hooks[hookName] ?? []);
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

export { Hub, createHub, defaultBodyController, defaultExtractContract, defaultNotfoundHandler, hubKind };
