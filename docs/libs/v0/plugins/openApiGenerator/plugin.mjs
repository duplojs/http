import { routeToOpenApi } from './routeToOpenApi.mjs';
import { equal, A, pipe, O, G, P, justReturn, asserts, E } from '@duplojs/utils';
import { makeOpenApiPage } from './makeOpenApiPage.mjs';
import { makeOpenApiRoute } from './makeOpenApiRoute.mjs';
import { SF } from '@duplojs/server-utils';

function openApiGeneratorPlugin(pluginParams) {
    return () => ({
        name: "open-api-generator",
        hooksHubLifeCycle: [
            {
                beforeServerBuildRoutes: async (hub) => {
                    if (!equal(hub.config.environment, ["DEV", "BUILD"])
                        || (!pluginParams.routePath
                            && !pluginParams.outputFile)) {
                        return;
                    }
                    const contextToJsonSchemaFactory = new Map();
                    const resultSchemaContext = new Map();
                    const routes = A.from(hub.routes);
                    const openApiRoutes = pipe(routes, A.filter((route) => route.definition.method !== "OPTIONS"), A.flatMap((route) => routeToOpenApi(route, {
                        defaultExtractContract: hub.defaultExtractContract,
                        resultSchemaContext,
                        contextToJsonSchemaFactory,
                    })));
                    if (!A.minElements(openApiRoutes, 1)) {
                        return;
                    }
                    const paths = pipe(openApiRoutes, A.group((element, { output }) => output(element.path, element)), O.entries, A.filter((entry) => entry[1] !== undefined), A.map(([path, value]) => pipe(value, A.group(({ method, path, ...rest }, { output }) => output(method, rest)), O.entries, A.filter((entry) => entry[1] !== undefined), A.map(([method, value]) => O.entry(method, A.first(value))), O.fromEntries, (value) => O.entry(path, value))), O.fromEntries);
                    const schemaComponents = G.reduce(resultSchemaContext.values(), G.reduceFrom({}), ({ lastValue, element, nextWithObject }) => nextWithObject(lastValue, element));
                    const securityScheme = P.match(pluginParams.security)
                        .with({ type: "bearer" }, (security) => ({
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: security.bearerFormat ?? "JWT",
                    }))
                        .with({ type: "basic" }, justReturn({
                        type: "http",
                        scheme: "basic",
                    }))
                        .with({ type: "apiKey" }, (security) => ({
                        type: "apiKey",
                        name: security.paramName,
                        in: security.in,
                    }))
                        .otherwise(justReturn(undefined));
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
                        asserts(await SF.writeTextFile(pluginParams.outputFile, openApiDocumentString), E.isRight);
                    }
                    if (pluginParams.routePath) {
                        const openApiPage = makeOpenApiPage({
                            openApiDocument: openApiDocumentString,
                            pageTitle: pluginParams.title ?? "Swagger API",
                            swaggerUiVersion: pluginParams.swaggerUiVersion ?? "5.31.0",
                        });
                        const openApiRoute = makeOpenApiRoute(pluginParams.routePath, openApiPage);
                        return hub.register(openApiRoute);
                    }
                    return;
                },
            },
        ],
    });
}

export { openApiGeneratorPlugin };
