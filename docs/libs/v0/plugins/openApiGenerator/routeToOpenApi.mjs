import { aggregateStepContract } from './aggregateStepContract.mjs';
import { O, A, pipe, DP, when, justReturn, whenNot, P, isType, S } from '@duplojs/utils';
import { render, defaultTransformers } from '@duplojs/data-parser-tools/toJsonSchema';
import { IgnoreByOpenApiGeneratorMetadata } from './metadata.mjs';

function factoryJsonSchema(params) {
    const identifier = params.schema.definition.identifier
        ?? `NotIdentified${params.resultSchemaContext.size}`;
    const renderResult = render(params.schema, {
        identifier,
        mode: params.mode,
        context: params.context,
        version: "openApi31",
        transformers: defaultTransformers,
    });
    params.resultSchemaContext.set(identifier, renderResult.components.schemas);
    return O.pick(renderResult, { $ref: true });
}
const parameterKeyMapper = {
    query: "query",
    params: "path",
    headers: "header",
};
const methodMapper = {
    GET: "get",
    POST: "post",
    PUT: "put",
    DELETE: "delete",
    HEAD: "head",
    TRACE: "trace",
    CONNECT: "connect",
    OPTIONS: "options",
};
function routeToOpenApi(route, params) {
    const isIgnore = A.find(route.definition.metadata, IgnoreByOpenApiGeneratorMetadata.is);
    if (isIgnore) {
        return [];
    }
    const aggregateStepResult = aggregateStepContract([
        ...route.definition.preflightSteps,
        ...route.definition.steps,
    ], {
        defaultExtractContract: params.defaultExtractContract,
    });
    const { body, ...restEntrypoint } = aggregateStepResult.entrypointContract;
    const parameters = pipe(restEntrypoint, O.entries, A.select(({ element: [key, value], select, skip }) => !DP.dataParserKind.has(value) && O.countKeys(value)
        ? select(O.entry(key, O.entries(value)))
        : skip()), A.flatMap(([key, value]) => A.map(value, ([name, schema]) => ({
        name,
        in: parameterKeyMapper[key],
        required: !DP.identifier(schema, DP.optionalKind),
        schema: factoryJsonSchema({
            context: params.contextToJsonSchemaFactory,
            resultSchemaContext: params.resultSchemaContext,
            mode: "in",
            schema,
        }),
    }))));
    const requestBody = pipe(body, when((value) => O.countKeys(value) === 0, justReturn(DP.empty())), whenNot(DP.dataParserKind.has, DP.object), P.when(DP.identifier(DP.emptyKind), justReturn(undefined)), P.when(DP.identifier(DP.objectKind), (objectSchema) => ({
        required: true,
        content: {
            "application/json": {
                schema: factoryJsonSchema({
                    context: params.contextToJsonSchemaFactory,
                    resultSchemaContext: params.resultSchemaContext,
                    mode: "in",
                    schema: objectSchema,
                }),
            },
        },
    })), P.otherwise((primitiveSchema) => ({
        required: true,
        content: {
            "text/plain": {
                schema: factoryJsonSchema({
                    context: params.contextToJsonSchemaFactory,
                    resultSchemaContext: params.resultSchemaContext,
                    mode: "in",
                    schema: primitiveSchema,
                }),
            },
        },
    })));
    const responses = pipe(aggregateStepResult.endpointContract, A.reduce(A.reduceFrom({}), ({ lastValue, element: { information, body, code }, nextWithObject }) => {
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
        const headerDescription = P.match(lastValue[code])
            .when(isType("object"), (value) => {
            if (S.includes(value.headers.information.description, information)) {
                return value.headers.information.description;
            }
            return S.concat(value.headers.information.description, " | ", information);
        })
            .when(isType("undefined"), justReturn(information))
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
        const content = pipe(body, P.when(DP.identifier(DP.emptyKind), justReturn(lastValue[code]?.content)), P.otherwise((value) => {
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
        }));
        return nextWithObject(lastValue, {
            [code]: {
                headers,
                content,
            },
        });
    }));
    return A.map(route.definition.paths, (path) => ({
        path,
        method: methodMapper[route.definition.method],
        parameters,
        requestBody,
        responses,
    }));
}

export { routeToOpenApi };
