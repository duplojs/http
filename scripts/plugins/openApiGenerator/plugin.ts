import type { HubPlugin } from "@core/hub";
import type { JsonSchema, MapContext } from "@duplojs/data-parser-tools/toJsonSchema";
import { routeToOpenApi, type ResultSchemaContext } from "./routeToOpenApi";
import { A, G, justReturn, O, P, pipe } from "@duplojs/utils";
import { makeOpenApiPage } from "./makeOpenApiPage";
import { makeOpenApiRoute } from "./makeOpenApiRoute";
import { writeFile } from "fs/promises";
import type { RoutePath } from "@core/route";
import type { OpenApiDocument } from "./types/openApiDocument";
import type { OpenApiSecuritySchema, SupportedBearerFormat } from "./types";

interface OpenApiSecurityOptionBearer {
	type: "bearer";
	bearerFormat?: SupportedBearerFormat;
}

interface OpenApiSecurityOptionApiKey {
	type: "apiKey";
	paramName: string;
	in: "header" | "query" | "cookie";
}

interface OpenApiSecurityOptionBasic {
	type: "basic";
}

export interface OpenApiGeneratorPluginParams {
	routePath: RoutePath;
	outputFilePath?: string;

	/**
	 * @default "Swagger API"
	 */
	title?: string;

	/**
	 * @default "0.0.0"
	 */
	version?: string;
	summary?: string;
	contact?: {
		name?: string;
		email?: string;
		url?: string;
	};
	license?: {
		name: string;
		url?: string;
		identifier?: string;
	};
	security?:
		| OpenApiSecurityOptionBearer
		| OpenApiSecurityOptionApiKey
		| OpenApiSecurityOptionBasic;
	servers?: {
		url: string;
		description?: string;
	}[];

	/**
	 * @default "5.31.0"
	 */
	swaggerUiVersion?: string;
}

export function openApiGeneratorPlugin(pluginParams: OpenApiGeneratorPluginParams) {
	return (): HubPlugin => ({
		name: "open-api-generator",
		hooksHubLifeCycle: [
			{
				beforeServerBuildRoutes: async(hub) => {
					const contextToJsonSchemaFactory: MapContext = new Map();
					const resultSchemaContext: ResultSchemaContext = new Map();
					const routes = hub.aggregatesRoutes();

					const openApiRoutes = pipe(
						routes,
						A.filter((route) => route.definition.method !== "OPTIONS"),
						A.flatMap(
							(route) => routeToOpenApi(route, {
								defaultExtractContract: hub.defaultExtractContract,
								resultSchemaContext,
								contextToJsonSchemaFactory,
							}),
						),
					);

					if (!A.minElements(openApiRoutes, 1)) {
						return;
					}

					const paths = pipe(
						openApiRoutes,
						A.group(
							(element, { output }) => output(element.path, element),
						),
						O.entries,
						A.filter((entry) => entry[1] !== undefined),
						A.map(
							([path, value]) => pipe(
								value,
								A.group(
									({ method, path, ...rest }, { output }) => output(
										method,
										rest,
									),
								),
								O.entries,
								A.filter((entry) => entry[1] !== undefined),
								A.map(
									([method, value]) => O.entry(
										method,
										A.first(value),
									),

								),
								O.fromEntries,
								(value) => O.entry(path, value),
							),
						),
						O.fromEntries,
					);

					const schemaComponents = G.reduce(
						resultSchemaContext.values(),
						G.reduceFrom<Record<string, JsonSchema>>({}),
						({ lastValue, element, nextWithObject }) => nextWithObject(
							lastValue,
							element,
						),
					);

					const securityScheme: OpenApiSecuritySchema | undefined = P.match(
						pluginParams.security,
					)
						.with(
							{ type: "bearer" },
							(security) => (<const>{
								type: "http",
								scheme: "bearer",
								bearerFormat: security.bearerFormat ?? "JWT",
							}),
						)
						.with(
							{ type: "basic" },
							justReturn(<const>{
								type: "http",
								scheme: "basic",
							}),
						)
						.with(
							{ type: "apiKey" },
							(security) => ({
								type: <const>"apiKey",
								name: security.paramName,
								in: security.in,
							}),
						)
						.otherwise(justReturn(undefined));

					const securitySchemeName = "auth";

					const securitySchemes = securityScheme
						? {
							[securitySchemeName]: securityScheme,
						}
						: undefined;

					const openApiDocument: OpenApiDocument = {
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

					if (pluginParams.outputFilePath) {
						await writeFile(
							pluginParams.outputFilePath,
							openApiDocumentString,
						);
					}

					const openApiPage = makeOpenApiPage({
						openApiDocument: openApiDocumentString,
						pageTitle: pluginParams.title ?? "Swagger API",
						swaggerUiVersion: pluginParams.swaggerUiVersion ?? "5.31.0",
					});

					const openApiRoute = makeOpenApiRoute(
						pluginParams.routePath,
						openApiPage,
					);

					return hub.register(openApiRoute);
				},
			},
		],
	});
}
