import { toRegExp, pipe, A, G } from '@duplojs/utils';
import { IgnoreRouteCorsMetadata } from './metadata.mjs';
import { createRoute } from '../../core/route/index.mjs';
import './headerFunctions/index.mjs';
import { varyFunction } from './headerFunctions/vary.mjs';
import { allowOriginFunction } from './headerFunctions/allowOrigin.mjs';
import { exposeHeadersFunction } from './headerFunctions/exposeHeaders.mjs';
import { credentialsFunction } from './headerFunctions/credentials.mjs';
import { createHookRouteLifeCycle } from '../../core/route/hooks.mjs';
import { allowMethodsFunction } from './headerFunctions/allowMethods.mjs';
import { allowHeadersFunction } from './headerFunctions/allowHeaders.mjs';
import { maxAgeFunction } from './headerFunctions/maxAge.mjs';

/* eslint-disable @typescript-eslint/prefer-for-of */
function corsPlugin(params) {
    const headerFunctionOtherRoutes = [];
    if (params.allowOrigin) {
        headerFunctionOtherRoutes.push(varyFunction.default());
        headerFunctionOtherRoutes.push(typeof params.allowOrigin === "function"
            ? allowOriginFunction.isFunction(params.allowOrigin)
            : allowOriginFunction.default(toRegExp(params.allowOrigin === true
                ? "*"
                : params.allowOrigin)));
    }
    if (params.exposeHeaders) {
        headerFunctionOtherRoutes.push(pipe(params.exposeHeaders, A.coalescing, A.join(","), exposeHeadersFunction.default));
    }
    if (params.credentials) {
        headerFunctionOtherRoutes.push(credentialsFunction.default());
    }
    const hookOtherRoute = createHookRouteLifeCycle({
        beforeSendResponse: (params) => {
            for (let index = 0; index < headerFunctionOtherRoutes.length; index++) {
                headerFunctionOtherRoutes[index](params.request, params.currentResponse);
            }
            return params.next();
        },
    });
    return () => ({
        name: "cors",
        hooksHubLifeCycle: [
            {
                beforeServerBuildRoutes: (hub) => {
                    const headerFunctionRouteOptions = [];
                    if (params.allowMethods === true) {
                        const allowMethodsFunctionIsBool = pipe(hub.routes, G.filter((route) => !A.some(route.definition.metadata, IgnoreRouteCorsMetadata.is)), G.map((route) => A.map(route.definition.paths, (path) => ({
                            path,
                            method: route.definition.method,
                        }))), G.flat, G.reduce(G.reduceFrom({}), ({ element, lastValue, next }) => {
                            lastValue[element.path] = lastValue[element.path]
                                ? `${lastValue[element.path]},${element.method}`
                                : element.method;
                            return next(lastValue);
                        }), allowMethodsFunction.isBool);
                        headerFunctionRouteOptions.push(allowMethodsFunctionIsBool);
                    }
                    else if (params.allowMethods) {
                        headerFunctionRouteOptions.push(pipe(params.allowMethods, A.coalescing, A.join(","), allowMethodsFunction.default));
                    }
                    if (params.allowHeaders) {
                        headerFunctionRouteOptions.push(allowHeadersFunction.default(params.allowHeaders === true
                            ? "*"
                            : pipe(params.allowHeaders, A.coalescing, A.join(","))));
                    }
                    if (params.maxAge) {
                        headerFunctionRouteOptions.push(maxAgeFunction.default(params.maxAge.toString()));
                    }
                    const hookRouteOptions = createHookRouteLifeCycle({
                        beforeRouteExecution: (params) => {
                            const response = params.response("204", "cors");
                            for (let index = 0; index < headerFunctionRouteOptions.length; index++) {
                                headerFunctionRouteOptions[index](params.request, response);
                            }
                            return response;
                        },
                    });
                    const routeOptions = createRoute({
                        paths: ["/*"],
                        method: "OPTIONS",
                        hooks: [hookRouteOptions],
                        metadata: [IgnoreRouteCorsMetadata()],
                        steps: [],
                        preflightSteps: [],
                        bodyController: null,
                    });
                    hub.register(routeOptions);
                    return hub;
                },
                beforeBuildRoute: (route) => {
                    if (route.definition.method === "OPTIONS" || A.some(route.definition.metadata, IgnoreRouteCorsMetadata.is)) {
                        return route;
                    }
                    return {
                        ...route,
                        definition: {
                            ...route.definition,
                            hooks: [...route.definition.hooks, hookOtherRoute],
                        },
                    };
                },
            },
        ],
    });
}

export { corsPlugin };
