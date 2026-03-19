'use strict';

var utils = require('@duplojs/utils');
var metadata = require('./metadata.cjs');
var index = require('../../core/route/index.cjs');
require('./headerFunctions/index.cjs');
var vary = require('./headerFunctions/vary.cjs');
var allowOrigin = require('./headerFunctions/allowOrigin.cjs');
var exposeHeaders = require('./headerFunctions/exposeHeaders.cjs');
var credentials = require('./headerFunctions/credentials.cjs');
var hooks = require('../../core/route/hooks.cjs');
var allowMethods = require('./headerFunctions/allowMethods.cjs');
var allowHeaders = require('./headerFunctions/allowHeaders.cjs');
var maxAge = require('./headerFunctions/maxAge.cjs');

/* eslint-disable @typescript-eslint/prefer-for-of */
function corsPlugin(params) {
    const headerFunctionOtherRoutes = [];
    if (params.allowOrigin) {
        headerFunctionOtherRoutes.push(vary.varyFunction.default());
        headerFunctionOtherRoutes.push(typeof params.allowOrigin === "function"
            ? allowOrigin.allowOriginFunction.isFunction(params.allowOrigin)
            : allowOrigin.allowOriginFunction.default(utils.toRegExp(params.allowOrigin === true
                ? "*"
                : params.allowOrigin)));
    }
    if (params.exposeHeaders) {
        headerFunctionOtherRoutes.push(utils.pipe(params.exposeHeaders, utils.A.coalescing, utils.A.join(","), exposeHeaders.exposeHeadersFunction.default));
    }
    if (params.credentials) {
        headerFunctionOtherRoutes.push(credentials.credentialsFunction.default());
    }
    const hookOtherRoute = hooks.createHookRouteLifeCycle({
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
                        const allowMethodsFunctionIsBool = utils.pipe(hub.routes, utils.G.filter((route) => !utils.A.some(route.definition.metadata, metadata.IgnoreRouteCorsMetadata.is)), utils.G.map((route) => utils.A.map(route.definition.paths, (path) => ({
                            path,
                            method: route.definition.method,
                        }))), utils.G.flat, utils.G.reduce(utils.G.reduceFrom({}), ({ element, lastValue, next }) => {
                            lastValue[element.path] = lastValue[element.path]
                                ? `${lastValue[element.path]},${element.method}`
                                : element.method;
                            return next(lastValue);
                        }), allowMethods.allowMethodsFunction.isBool);
                        headerFunctionRouteOptions.push(allowMethodsFunctionIsBool);
                    }
                    else if (params.allowMethods) {
                        headerFunctionRouteOptions.push(utils.pipe(params.allowMethods, utils.A.coalescing, utils.A.join(","), allowMethods.allowMethodsFunction.default));
                    }
                    if (params.allowHeaders) {
                        headerFunctionRouteOptions.push(allowHeaders.allowHeadersFunction.default(params.allowHeaders === true
                            ? "*"
                            : utils.pipe(params.allowHeaders, utils.A.coalescing, utils.A.join(","))));
                    }
                    if (params.maxAge) {
                        headerFunctionRouteOptions.push(maxAge.maxAgeFunction.default(params.maxAge.toString()));
                    }
                    const hookRouteOptions = hooks.createHookRouteLifeCycle({
                        beforeRouteExecution: (params) => {
                            const response = params.response("204", "cors");
                            for (let index = 0; index < headerFunctionRouteOptions.length; index++) {
                                headerFunctionRouteOptions[index](params.request, response);
                            }
                            return response;
                        },
                    });
                    const routeOptions = index.createRoute({
                        paths: ["/*"],
                        method: "OPTIONS",
                        hooks: [hookRouteOptions],
                        metadata: [metadata.IgnoreRouteCorsMetadata()],
                        steps: [],
                        preflightSteps: [],
                        bodyController: null,
                    });
                    hub.register(routeOptions);
                    return hub;
                },
                beforeBuildRoute: (route) => {
                    if (route.definition.method === "OPTIONS" || utils.A.some(route.definition.metadata, metadata.IgnoreRouteCorsMetadata.is)) {
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

exports.corsPlugin = corsPlugin;
