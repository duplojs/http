import type { Route } from "@core/route";
import { aggregateStepContract } from "./aggregateStepContract";
import { A, DP, isType, justExec, justReturn, O, P, pipe, S, when, whenNot } from "@duplojs/utils";
import { ResponseContract } from "@core/response";
import { type MapContext, type JsonSchema, render, defaultTransformers } from "@duplojs/data-parser-tools/toJsonSchema";
import { FormDataBodyController, type RequestMethods } from "@core/request";
import type { EndpointResponse, EndpointResponseContent, EntrypointParameter, OpenApiMethod } from "./types";
import { IgnoreByOpenApiGeneratorMetadata } from "./metadata";

export type ResultSchemaContext = Map<string, Record<string, JsonSchema>>;

export interface RouteToOpenApiParams {
	readonly contextToJsonSchemaFactory: MapContext;
	readonly resultSchemaContext: ResultSchemaContext;
	readonly defaultExtractContract: ResponseContract.Contract;
}

interface FactoryParams {
	context: MapContext;
	resultSchemaContext: ResultSchemaContext;
	schema: DP.DataParser;
}

function factoryJsonSchema(params: FactoryParams) {
	const identifier = params.schema.definition.identifier
		?? `NotIdentified${params.resultSchemaContext.size}`;

	const renderResult = render(
		params.schema,
		{
			identifier,
			mode: "in",
			context: params.context,
			version: "openApi31",
			transformers: defaultTransformers,
		},
	);

	params.resultSchemaContext.set(identifier, renderResult.components.schemas);

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
	TRACE: "trace",
	CONNECT: "connect",
	OPTIONS: "options",
	PATCH: "patch",
} as const satisfies Record<RequestMethods, OpenApiMethod>;

export function routeToOpenApi(
	route: Route,
	params: RouteToOpenApiParams,
) {
	const isIgnore = A.find(
		route.definition.metadata,
		IgnoreByOpenApiGeneratorMetadata.is,
	);

	if (isIgnore) {
		return [];
	}

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
		P.when(
			() => FormDataBodyController.is(route.definition.bodyController),
			(objectSchema) => ({
				required: <const>true,
				content: {
					"multipart/form-data": {
						schema: factoryJsonSchema({
							context: params.contextToJsonSchemaFactory,
							resultSchemaContext: params.resultSchemaContext,
							schema: objectSchema,
						}),
					},
				},
			}),
		),
		P.when(
			DP.identifier(DP.objectKind),
			(objectSchema) => ({
				required: <const>true,
				content: {
					"application/json": {
						schema: factoryJsonSchema({
							context: params.contextToJsonSchemaFactory,
							resultSchemaContext: params.resultSchemaContext,
							schema: objectSchema,
						}),
					},
				},
			}),
		),
		P.otherwise(
			(primitiveSchema) => ({
				required: <const>true,
				content: {
					"text/plain": {
						schema: factoryJsonSchema({
							context: params.contextToJsonSchemaFactory,
							resultSchemaContext: params.resultSchemaContext,
							schema: primitiveSchema,
						}),
					},
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
						string,
						EndpointResponse
					>
				>
			>({}),
			({ lastValue, element: contract, nextWithObject, next }) => {
				const { information, body, code } = contract;

				const headerInformation = {
					const: information,
					type: "string",
				};

				const headerDescription = P.match(lastValue[code])
					.when(
						isType("object"),
						(value) => {
							if (S.includes(value.headers.information.description, information)) {
								return value.headers.information.description;
							}
							return S.concat(
								value.headers.information.description,
								" | ",
								information,
							);
						},
					)
					.when(
						isType("undefined"),
						justReturn(information),
					)
					.exhaustive();

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
						description: headerDescription,
					},
				};

				if (ResponseContract.serverSentEventsContractKind.has(contract)) {
					const eventNameList = O.keys(contract.events);
					const eventDataList = O.values(contract.events);
					if (!A.minElements(eventNameList, 1) || !A.minElements(eventDataList, 1)) {
						return next(lastValue);
					}

					const schema = factoryJsonSchema({
						context: params.contextToJsonSchemaFactory,
						resultSchemaContext: params.resultSchemaContext,
						schema: DP.object({
							event: DP.literal(eventNameList),
							data: DP.union(eventDataList),
							id: DP.optional(DP.string()),
							retry: DP.optional(DP.number()),
						}),
					});

					const lastContent = lastValue[code]?.content;
					const content: EndpointResponseContent = {
						...lastContent,
						"text/event-stream": {
							itemSchema: lastContent?.["text/event-stream"]
								? {
									anyOf: [
										lastContent["text/event-stream"].itemSchema,
										schema,
									],
								}
								: schema,
						},
					};

					return nextWithObject(
						lastValue,
						{
							[code]: {
								headers,
								content,
							},
						},
					);
				}

				if (ResponseContract.streamContractKind.has(contract)) {
					const lastContent = lastValue[code]?.content;
					const schema = {
						type: "string",
						format: "binary",
					} as const;
					const content: EndpointResponseContent = {
						...lastContent,
						"application/octet-stream": {
							schema: lastContent?.["application/octet-stream"]
								? {
									anyOf: [
										lastContent["application/octet-stream"].schema,
										schema,
									],
								}
								: schema,
						},
					};

					return nextWithObject(
						lastValue,
						{
							[code]: {
								headers,
								content,
							},
						},
					);
				}

				if (ResponseContract.streamTextContractKind.has(contract)) {
					const lastContent = lastValue[code]?.content;
					const schema = factoryJsonSchema({
						context: params.contextToJsonSchemaFactory,
						resultSchemaContext: params.resultSchemaContext,
						schema: contract.flux,
					});
					const content: EndpointResponseContent = {
						...lastContent,
						"text/plain": {
							schema: lastContent?.["text/plain"]
								? {
									anyOf: [
										lastContent["text/plain"].schema,
										schema,
									],
								}
								: schema,
						},
					};

					return nextWithObject(
						lastValue,
						{
							[code]: {
								headers,
								content,
							},
						},
					);
				}

				const schemaResponse = factoryJsonSchema({
					context: params.contextToJsonSchemaFactory,
					resultSchemaContext: params.resultSchemaContext,
					schema: body,
				});

				const content = pipe(
					body,
					P.when(
						DP.identifier(DP.emptyKind),
						justReturn(lastValue[code]?.content),
					),
					P.otherwise(
						(value) => {
							if (DP.identifier(value, DP.stringKind) && lastValue[code]?.content?.["text/plain"]) {
								return lastValue[code].content;
							}

							if (DP.identifier(value, DP.stringKind)) {
								return {
									...lastValue[code]?.content,
									"text/plain": {
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
												lastValue[code].content["application/json"].schema,
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
