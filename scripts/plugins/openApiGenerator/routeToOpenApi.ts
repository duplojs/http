import { type Route } from "@core/route";
import { aggregateStepContract } from "./aggregateStepContract";
import { A, DP, justReturn, O, P, pipe, when, whenNot } from "@duplojs/utils";
import { type ResponseCode, type ResponseContract } from "@core/response";
import { type MapContext, type JsonSchema, type JsonSchemaLiteral, render, defaultTransformers, type JsonSchemaString } from "@duplojs/data-parser-tools/toJsonSchema";
import { type RequestMethods } from "@core/request";

export type ResultSchemaContext = Map<string, Record<string, JsonSchema>>;

export interface EntrypointParameter {
	name: string;
	in: "path" | "query" | "header";
	required: boolean;
	schema: JsonSchema;
}

export interface EntrypointRequestBody {
	required: true;
	content: {
		"application/json": JsonSchema;
	};
}

export interface EndpointResponse {
	headers: {
		information: {
			schema: JsonSchemaLiteral;
		};
		[headerKey: string]: {
			schema: JsonSchemaLiteral;
		};
	};
	content?: {
		"application/json"?: {
			schema: JsonSchema;
		};
		"plain/text"?: {
			schema: JsonSchemaString;
		};
	};
}

export type OpenApiMethod = "get" | "post" | "put" | "delete" | "head" | "options" | "trace" | "connect";

export interface RouteToOpenApiParams {
	readonly contextToJsonSchemaFactory: MapContext;
	readonly resultSchemaContext: ResultSchemaContext;
	readonly defaultExtractContract: ResponseContract.Contract;
}

interface FactoryInput {
	context: MapContext;
	resultSchemaContext: ResultSchemaContext;
	schema: DP.DataParser;
	mode: "in" | "out";
}

function factoryJsonSchema({
	context,
	resultSchemaContext,
	schema,
	mode,
}: FactoryInput) {
	const identifier = schema.definition.identifier ?? `NotIdentified${resultSchemaContext.size}`;

	const renderResult = render(
		schema,
		{
			identifier,
			mode,
			context,
			version: "openApi31",
			transformers: defaultTransformers,
		},
	);

	resultSchemaContext.set(identifier, renderResult.components.schemas);

	return O.pick(renderResult, { $ref: true });
}

const parameterKeyMapper = {
	query: "query",
	params: "path",
	headers: "header",
} as const;

const methodMapper = {
	GET: "get",
	POST: "post",
	PUT: "put",
	DELETE: "delete",
	HEAD: "head",
	OPTIONS: "options",
	TRACE: "trace",
	CONNECT: "connect",
} as const satisfies Record<RequestMethods, OpenApiMethod>;

export function routeToOpenApi(
	route: Route,
	params: RouteToOpenApiParams,
) {
	const aggregateStepResult = aggregateStepContract(
		[
			...route.definition.preflightSteps,
			...route.definition.steps,
		],
		{
			defaultExtractContract: params.defaultExtractContract,
		},
	);

	const { body, ...restEntrypoint } = aggregateStepResult.entrypointContract;

	const parameters = pipe(
		restEntrypoint,
		O.entries,
		A.select(
			(
				{ element: [key, value], select, skip },
			) => !DP.dataParserKind.has(value) && O.countKeys(value)
				? select(O.entry(key, O.entries(value)))
				: skip(),
		),
		A.flatMap(
			([key, value]) => A.map(
				value,
				([name, schema]): EntrypointParameter => ({
					name,
					in: parameterKeyMapper[key],
					required: !DP.identifier(schema, DP.optionalKind),
					schema: factoryJsonSchema({
						context: params.contextToJsonSchemaFactory,
						resultSchemaContext: params.resultSchemaContext,
						mode: "in",
						schema,
					}),
				}),
			),
		),
	);

	const requestBody = pipe(
		body,
		when(
			(value) => O.countKeys(value) === 0,
			justReturn(DP.empty()),
		),
		whenNot(
			DP.dataParserKind.has,
			DP.object,
		),
		P.when(
			DP.identifier(DP.emptyKind),
			justReturn(undefined),
		),
		P.otherwise(
			(schema) => ({
				required: <const>true,
				content: {
					"application/json": factoryJsonSchema({
						context: params.contextToJsonSchemaFactory,
						resultSchemaContext: params.resultSchemaContext,
						mode: "in",
						schema,
					}),
				},
			}),
		),
	);

	const responses = pipe(
		aggregateStepResult.endpointContract,
		A.reduce(
			A.reduceFrom<
				Partial<
					Record<
						ResponseCode,
						EndpointResponse
					>
				>
			>({}),
			({ lastValue, element: { information, body, code }, nextWithObject }) => {
				const schemaResponse = !DP.identifier(body, DP.emptyKind)
					? factoryJsonSchema({
						context: params.contextToJsonSchemaFactory,
						resultSchemaContext: params.resultSchemaContext,
						mode: "in",
						schema: body,
					})
					: undefined;

				const headerInformation = {
					const: information,
					type: "string",
				};

				const headers = {
					information: {
						schema: lastValue[code]
							? {
								anyOf: [
									lastValue[code].headers.information.schema,
									headerInformation,
								],
							}
							: headerInformation,
					},
				};

				const content = pipe(
					body,
					P.when(
						DP.identifier(DP.emptyKind),
						justReturn(lastValue[code]?.content),
					),
					P.otherwise(
						(value) => {
							if (DP.identifier(value, DP.stringKind) && lastValue[code]?.content?.["plain/text"]) {
								return lastValue[code].content;
							}

							if (DP.identifier(value, DP.stringKind)) {
								return {
									...lastValue[code]?.content,
									"plain/text": {
										schema: schemaResponse,
									},
								};
							}

							if (DP.identifier(value, DP.objectKind) && lastValue[code]?.content?.["application/json"]) {
								return {
									...lastValue[code]?.content,
									"application/json": {
										schema: {
											anyOf: [
												lastValue[code]?.content["application/json"].schema,
												schemaResponse,
											],
										},
									},
								};
							}

							return {
								"application/json": {
									schema: schemaResponse,
								},
							};
						},
					),
				);

				return nextWithObject(
					lastValue,
					{
						[code]: {
							headers,
							content,
						},
					},
				);
			},
		),
	);

	return A.map(
		route.definition.paths,
		(path) => ({
			path,
			method: methodMapper[route.definition.method],
			parameters,
			requestBody,
			responses,
		}),
	);
}
