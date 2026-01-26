import { createCoreLibKind } from '../kind.mjs';
import { routeKind } from '../route/index.mjs';
import { A, pipe, P, isType, O } from '@duplojs/utils';
import '../steps/index.mjs';
import { Request } from '../request.mjs';
import { defaultNotfoundHandler } from './defaultNotfoundHandler.mjs';
import { defaultExtractContract } from './defaultExtractContract.mjs';
export { createHookHubLifeCycle, hookServerExitKind, hookServerNextKind, launchHookBeforeBuildRoute, launchHookServer, launchHookServerError, serverErrorExitHookFunction, serverErrorNextHookFunction } from './hooks.mjs';
import { createHandlerStep } from '../steps/handler.mjs';

const hubKind = createCoreLibKind("hub");
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
        notfoundHandler: defaultNotfoundHandler,
        defaultExtractContract,
        classRequest: Request,
        addHubHooks(hook) {
            return {
                ...this,
                hooksHubLifeCycle: A.concat(this.hooksHubLifeCycle, A.coalescing(hook)),
            };
        },
        addRouteFunctionBuilder(functionBuilder) {
            return {
                ...this,
                routeFunctionBuilders: A.concat(this.routeFunctionBuilders, A.coalescing(functionBuilder)),
            };
        },
        addRouteHooks(hook) {
            return {
                ...this,
                hooksRouteLifeCycle: A.concat(this.hooksRouteLifeCycle, A.coalescing(hook)),
            };
        },
        addStepFunctionBuilder(hook) {
            return {
                ...this,
                stepFunctionBuilders: A.concat(this.stepFunctionBuilders, A.coalescing(hook)),
            };
        },
        plug(plugin) {
            return {
                ...this,
                plugins: A.push(this.plugins, typeof plugin === "function"
                    ? plugin(this)
                    : plugin),
            };
        },
        register(route) {
            return {
                ...this,
                routes: A.concat(this.routes, pipe(route, P.when(routeKind.has, A.coalescing), P.when(isType("iterable"), A.from), P.otherwise(O.values), A.filter((route) => !A.includes(this.routes, route)))),
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
                notfoundHandler: createHandlerStep({
                    responseContract,
                    theFunction: (floor, params) => theFunction(params),
                    metadata: [],
                }),
            };
        },
        aggregates() {
            return A.reduce(this.plugins, A.reduceFrom({
                hooksRouteLifeCycle: this.hooksRouteLifeCycle,
                routeFunctionBuilders: this.routeFunctionBuilders,
                stepFunctionBuilders: this.stepFunctionBuilders,
                routes: this.routes,
                hooksHubLifeCycle: this.hooksHubLifeCycle,
            }), ({ lastValue, element: plugin, next, }) => next({
                hooksRouteLifeCycle: plugin.hooksRouteLifeCycle
                    ? A.concat(lastValue.hooksRouteLifeCycle, plugin.hooksRouteLifeCycle)
                    : lastValue.hooksRouteLifeCycle,
                routeFunctionBuilders: plugin.routeFunctionBuilders
                    ? A.concat(lastValue.routeFunctionBuilders, plugin.routeFunctionBuilders)
                    : lastValue.routeFunctionBuilders,
                stepFunctionBuilders: plugin.stepFunctionBuilders
                    ? A.concat(lastValue.stepFunctionBuilders, plugin.stepFunctionBuilders)
                    : lastValue.stepFunctionBuilders,
                routes: plugin.routes
                    ? A.concat(lastValue.routes, plugin.routes)
                    : lastValue.routes,
                hooksHubLifeCycle: plugin.hooksHubLifeCycle
                    ? A.concat(lastValue.hooksHubLifeCycle, plugin.hooksHubLifeCycle)
                    : lastValue.hooksHubLifeCycle,
            }));
        },
        aggregatesRoutes() {
            return A.reduce(this.plugins, A.reduceFrom(this.routes), ({ lastValue, element: { routes }, next, }) => routes
                ? next(A.concat(lastValue, routes))
                : next(lastValue));
        },
        aggregatesRouteFunctionBuilders() {
            return A.reduce(this.plugins, A.reduceFrom(this.routeFunctionBuilders), ({ lastValue, element: { routeFunctionBuilders }, next, }) => routeFunctionBuilders
                ? next(A.concat(lastValue, routeFunctionBuilders))
                : next(lastValue));
        },
        aggregatesStepFunctionBuilders() {
            return A.reduce(this.plugins, A.reduceFrom(this.stepFunctionBuilders), ({ lastValue, element: { stepFunctionBuilders }, next, }) => stepFunctionBuilders
                ? next(A.concat(lastValue, stepFunctionBuilders))
                : next(lastValue));
        },
        aggregatesHooksHubLifeCycle(hookName) {
            const hooks = A.flatMap(this.hooksHubLifeCycle, (hooks) => hooks[hookName] ?? []);
            return A.reduce(this.plugins, A.reduceFrom(hooks), ({ lastValue, element: { hooksHubLifeCycle }, next, }) => {
                if (!hooksHubLifeCycle) {
                    return next(lastValue);
                }
                return next(A.concat(lastValue, A.flatMap(hooksHubLifeCycle, (hooks) => hooks[hookName] ?? [])));
            });
        },
        aggregatesHooksRouteLifeCycle(hookName) {
            const hooks = A.flatMap(this.hooksRouteLifeCycle, (hooks) => hooks[hookName] ?? []);
            return A.reduce(this.plugins, A.reduceFrom(hooks), ({ lastValue, element: { hooksRouteLifeCycle }, next, }) => {
                if (!hooksRouteLifeCycle) {
                    return next(lastValue);
                }
                return next(A.concat(lastValue, A.flatMap(hooksRouteLifeCycle, (hooks) => hooks[hookName] ?? [])));
            });
        },
    };
}

export { createHub, defaultExtractContract, defaultNotfoundHandler, hubKind };
