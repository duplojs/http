'use strict';

var aggregateStepContract = require('./aggregateStepContract.cjs');
var utils = require('@duplojs/utils');
var toJsonSchema = require('@duplojs/data-parser-tools/toJsonSchema');
require('../../core/request/index.cjs');
var metadata = require('./metadata.cjs');
var formData = require('../../core/request/bodyController/formData.cjs');

function factoryJsonSchema(params) {
    const identifier = params.schema.definition.identifier
        ?? `NotIdentified${params.resultSchemaContext.size}`;
    const renderResult = toJsonSchema.render(params.schema, {
        identifier,
        mode: params.mode,
        context: params.context,
        version: "openApi31",
        transformers: toJsonSchema.defaultTransformers,
    });
    params.resultSchemaContext.set(identifier, renderResult.components.schemas);
    return utils.O.pick(renderResult, { $ref: true });
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
    PATCH: "patch",
};
function routeToOpenApi(route, params) {
    const isIgnore = utils.A.find(route.definition.metadata, metadata.IgnoreByOpenApiGeneratorMetadata.is);
    if (isIgnore) {
        return [];
    }
    const aggregateStepResult = aggregateStepContract.aggregateStepContract([
        ...route.definition.preflightSteps,
        ...route.definition.steps,
    ], {
        defaultExtractContract: params.defaultExtractContract,
    });
    const { body, ...restEntrypoint } = aggregateStepResult.entrypointContract;
    const parameters = utils.pipe(restEntrypoint, utils.O.entries, utils.A.select(({ element: [key, value], select, skip }) => !utils.DP.dataParserKind.has(value) && utils.O.countKeys(value)
        ? select(utils.O.entry(key, utils.O.entries(value)))
        : skip()), utils.A.flatMap(([key, value]) => utils.A.map(value, ([name, schema]) => ({
        name,
        in: parameterKeyMapper[key],
        required: !utils.DP.identifier(schema, utils.DP.optionalKind),
        schema: factoryJsonSchema({
            context: params.contextToJsonSchemaFactory,
            resultSchemaContext: params.resultSchemaContext,
            mode: "in",
            schema,
        }),
    }))));
    const requestBody = utils.pipe(body, utils.when((value) => utils.O.countKeys(value) === 0, utils.justReturn(utils.DP.empty())), utils.whenNot(utils.DP.dataParserKind.has, utils.DP.object), utils.P.when(utils.DP.identifier(utils.DP.emptyKind), utils.justReturn(undefined)), utils.P.when(() => formData.FormDataBodyController.is(route.definition.bodyController), (objectSchema) => ({
        required: true,
        content: {
            "multipart/form-data": {
                schema: factoryJsonSchema({
                    context: params.contextToJsonSchemaFactory,
                    resultSchemaContext: params.resultSchemaContext,
                    mode: "in",
                    schema: objectSchema,
                }),
            },
        },
    })), utils.P.when(utils.DP.identifier(utils.DP.objectKind), (objectSchema) => ({
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
    })), utils.P.otherwise((primitiveSchema) => ({
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
    const responses = utils.pipe(aggregateStepResult.endpointContract, utils.A.reduce(utils.A.reduceFrom({}), ({ lastValue, element: { information, body, code }, nextWithObject }) => {
        const schemaResponse = !utils.DP.identifier(body, utils.DP.emptyKind)
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
        const headerDescription = utils.P.match(lastValue[code])
            .when(utils.isType("object"), (value) => {
            if (utils.S.includes(value.headers.information.description, information)) {
                return value.headers.information.description;
            }
            return utils.S.concat(value.headers.information.description, " | ", information);
        })
            .when(utils.isType("undefined"), utils.justReturn(information))
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
        const content = utils.pipe(body, utils.P.when(utils.DP.identifier(utils.DP.emptyKind), utils.justReturn(lastValue[code]?.content)), utils.P.otherwise((value) => {
            if (utils.DP.identifier(value, utils.DP.stringKind) && lastValue[code]?.content?.["plain/text"]) {
                return lastValue[code].content;
            }
            if (utils.DP.identifier(value, utils.DP.stringKind)) {
                return {
                    ...lastValue[code]?.content,
                    "plain/text": {
                        schema: schemaResponse,
                    },
                };
            }
            if (utils.DP.identifier(value, utils.DP.objectKind) && lastValue[code]?.content?.["application/json"]) {
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
    return utils.A.map(route.definition.paths, (path) => ({
        path,
        method: methodMapper[route.definition.method],
        parameters,
        requestBody,
        responses,
    }));
}

exports.routeToOpenApi = routeToOpenApi;
