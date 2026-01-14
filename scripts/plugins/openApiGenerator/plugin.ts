import { type HubPlugin } from "@core/hub";
import type { JsonSchema, MapContext } from "@duplojs/data-parser-tools/toJsonSchema";
import { routeToOpenApi, type ResultSchemaContext } from "./routeToOpenApi";
import { A, justReturn, O, P, pipe } from "@duplojs/utils";
import { writeFile } from "fs/promises";

export type OpenApiSecurityOptions =
	{
		type: "bearer";

		/**
		 * @default "JWT"
		 */
		bearerFormat?: "JWT" | "JWS" | "JWE" | "Opaque";
	}
	| {
		type: "apiKey";
		paramName: string;
		in: "header" | "query" | "cookie";
	}
	| {
		type: "basic";
	};

export interface OpenApiGeneratorPluginParams {
	outputFile: string;

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
	security?: OpenApiSecurityOptions;
	servers?: {
		url: string;
		description?: string;
	}[];
}

export interface OpenApiSecurityScheme {
	type: "http" | "apiKey";
	scheme?: "bearer" | "basic";
	bearerFormat?: "JWT" | "JWS" | "JWE" | "Opaque";
	name?: string;
	in?: "header" | "query" | "cookie";
}

export function openApiGeneratorPlugin(pluginParams: OpenApiGeneratorPluginParams) {
	return (): HubPlugin => ({
		name: "open-api-generator",
		hooksHubLifeCycle: [
			{
				beforeStartServer: async(hub) => {
					const contextToJsonSchemaFactory: MapContext = new Map();
					const resultSchemaContext: ResultSchemaContext = new Map();
					const routes = hub.aggregatesRoutes();

					const openApiRoutes = A.flatMap(
						routes,
						(route) => routeToOpenApi(route, {
							defaultExtractContract: hub.defaultExtractContract,
							resultSchemaContext,
							contextToJsonSchemaFactory,
						}),
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

					const schemaComponents = A.reduce(
						A.from(resultSchemaContext.values()),
						A.reduceFrom<Record<string, JsonSchema>>({}),
						({ lastValue, element, nextWithObject }) => nextWithObject(
							lastValue,
							{
								...lastValue,
								...element,
							},
						),
					);

					const securityScheme: OpenApiSecurityScheme | undefined = P.match(pluginParams.security)
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

					await writeFile(
						pluginParams.outputFile,
						JSON.stringify(openApiDocument, null, 2),
					);
				},
			},
		],
	});
}
