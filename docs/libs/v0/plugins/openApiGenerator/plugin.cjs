'use strict';

var routeToOpenApi = require('./routeToOpenApi.cjs');
var utils = require('@duplojs/utils');
var makeOpenApiPage = require('./makeOpenApiPage.cjs');
var makeOpenApiRoute = require('./makeOpenApiRoute.cjs');
var serverUtils = require('@duplojs/server-utils');

function openApiGeneratorPlugin(pluginParams) {
    return () => ({
        name: "open-api-generator",
        hooksHubLifeCycle: [
            {
                beforeServerBuildRoutes: async (hub) => {
                    if (!utils.equal(hub.config.environment, ["DEV", "BUILD"])
                        || (!pluginParams.routePath
                            && !pluginParams.outputFile)) {
                        return;
                    }
                    const contextToJsonSchemaFactory = new Map();
                    const resultSchemaContext = new Map();
                    const routes = utils.A.from(hub.routes);
                    const openApiRoutes = utils.pipe(routes, utils.A.filter((route) => route.definition.method !== "OPTIONS"), utils.A.flatMap((route) => routeToOpenApi.routeToOpenApi(route, {
                        defaultExtractContract: hub.defaultExtractContract,
                        resultSchemaContext,
                        contextToJsonSchemaFactory,
                    })));
                    if (!utils.A.minElements(openApiRoutes, 1)) {
                        return;
                    }
                    const paths = utils.pipe(openApiRoutes, utils.A.group((element, { output }) => output(element.path, element)), utils.O.entries, utils.A.filter((entry) => entry[1] !== undefined), utils.A.map(([path, value]) => utils.pipe(value, utils.A.group(({ method, path, ...rest }, { output }) => output(method, rest)), utils.O.entries, utils.A.filter((entry) => entry[1] !== undefined), utils.A.map(([method, value]) => utils.O.entry(method, utils.A.first(value))), utils.O.fromEntries, (value) => utils.O.entry(path, value))), utils.O.fromEntries);
                    const schemaComponents = utils.G.reduce(resultSchemaContext.values(), utils.G.reduceFrom({}), ({ lastValue, element, nextWithObject }) => nextWithObject(lastValue, element));
                    const securityScheme = utils.P.match(pluginParams.security)
                        .with({ type: "bearer" }, (security) => ({
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: security.bearerFormat ?? "JWT",
                    }))
                        .with({ type: "basic" }, utils.justReturn({
                        type: "http",
                        scheme: "basic",
                    }))
                        .with({ type: "apiKey" }, (security) => ({
                        type: "apiKey",
                        name: security.paramName,
                        in: security.in,
                    }))
                        .otherwise(utils.justReturn(undefined));
                    const securitySchemeName = "auth";
                    const securitySchemes = securityScheme
                        ? {
                            [securitySchemeName]: securityScheme,
                        }
                        : undefined;
                    const openApiDocument = {
                        openapi: "3.1.0",
                        info: {
                            title: pluginParams.title ?? "Swagger API",
                            version: pluginParams.version ?? "0.0.0",
                            summary: pluginParams.summary,
                            contact: pluginParams.contact,
                            license: pluginParams.license,
                        },
                        servers: pluginParams.servers,
                        paths,
                        components: {
                            schemas: schemaComponents,
                            securitySchemes,
                        },
                        security: pluginParams.security
                            ? [
                                {
                                    [securitySchemeName]: [],
                                },
                            ]
                            : undefined,
                    };
                    const openApiDocumentString = JSON.stringify(openApiDocument, null, 2);
                    if (pluginParams.outputFile) {
                        utils.asserts(await serverUtils.SF.writeTextFile(pluginParams.outputFile, openApiDocumentString), utils.E.isRight);
                    }
                    if (pluginParams.routePath) {
                        const openApiPage = makeOpenApiPage.makeOpenApiPage({
                            openApiDocument: openApiDocumentString,
                            pageTitle: pluginParams.title ?? "Swagger API",
                            swaggerUiVersion: pluginParams.swaggerUiVersion ?? "5.31.0",
                        });
                        const openApiRoute = makeOpenApiRoute.makeOpenApiRoute(pluginParams.routePath, openApiPage);
                        return hub.register(openApiRoute);
                    }
                    return;
                },
            },
        ],
    });
}

exports.openApiGeneratorPlugin = openApiGeneratorPlugin;
