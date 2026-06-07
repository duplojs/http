'use strict';

var DataParserToTypescript = require('@duplojs/data-parser-tools/toTypescript');
var utils = require('@duplojs/utils');
var routeToDataParser = require('./routeToDataParser.cjs');
var serverUtils = require('@duplojs/server-utils');
var typescriptTransformer = require('./typescriptTransformer.cjs');
var findIdentifiedDataParserInSteps = require('./findIdentifiedDataParserInSteps.cjs');
var dataParserTools = require('@duplojs/data-parser-tools');
var createSubDataParserBuildedContext = require('./createSubDataParserBuildedContext.cjs');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var DataParserToTypescript__namespace = /*#__PURE__*/_interopNamespaceDefault(DataParserToTypescript);

function codeGeneratorPlugin(pluginParams) {
    return () => ({
        name: "code-generator",
        hooksHubLifeCycle: [
            {
                beforeStartServer: async (hub) => {
                    if (!utils.equal(hub.config.environment, ["DEV", "BUILD"])) {
                        return;
                    }
                    const dataParserRoutes = utils.pipe(hub.routes, utils.G.map((route) => routeToDataParser.routeToDataParser(route, {
                        defaultExtractContract: hub.defaultExtractContract,
                    })), utils.G.flat, utils.A.from);
                    if (!utils.A.minElements(dataParserRoutes, 1)) {
                        return;
                    }
                    const output = DataParserToTypescript__namespace.render(utils.DP.union(dataParserRoutes), {
                        identifier: "Routes",
                        mode: "in",
                        transformers: typescriptTransformer.typescriptTransformers,
                    });
                    utils.asserts(await serverUtils.SF.writeTextFile(pluginParams.outputFile, output), utils.E.isRight);
                    if (pluginParams.generateDataParser) {
                        const generateDataParserParams = pluginParams.generateDataParser;
                        const buildedContext = {
                            context: new Map(),
                            importContext: new Map(),
                            typescriptContext: new Map(),
                            importMode: "lite",
                        };
                        const ignoreDataParser = new Set();
                        utils.pipe([], utils.A.concat(utils.pipe(generateDataParserParams.dataParsers ?? [], utils.A.flatMap((dataParser) => dataParserTools.DataParserFinder.dataParserFinder(dataParser, findIdentifiedDataParserInSteps.dataParserHasIdentifier, {
                            researchers: dataParserTools.DataParserFinder.defaultResearchers,
                            ignore: ignoreDataParser,
                        })))), utils.A.concat(utils.pipe(generateDataParserParams.disabledFromRoute
                            ? new Set()
                            : hub.routes, utils.G.map((route) => findIdentifiedDataParserInSteps.findIdentifiedDataParserInSteps(route.definition.steps, { ignoreDataParser })), utils.G.flat, utils.A.from)), utils.A.map((dataParser) => dataParserTools.DataParserToDataParser.buildContext(dataParser, {
                            identifier: dataParser.definition.identifier,
                            checkerTransformers: dataParserTools.DataParserToDataParser.defaultCheckerTransformers,
                            dataParserTransformers: dataParserTools.DataParserToDataParser.defaultTransformers,
                            typescriptTransformers: DataParserToTypescript__namespace.defaultTransformers,
                            ...buildedContext,
                        })));
                        await utils.asyncPipe(serverUtils.SF.exists(generateDataParserParams.outputFolder), utils.E.whenIsRight(async () => void utils.asserts(await serverUtils.SF.remove(generateDataParserParams.outputFolder, { recursive: true }), utils.E.isRight)), async () => void utils.asserts(await serverUtils.SF.makeDirectory(generateDataParserParams.outputFolder), utils.E.isRight));
                        utils.asserts(await serverUtils.SF.writeTextFile(utils.Path.resolveRelative([
                            generateDataParserParams.outputFolder,
                            "types.ts",
                        ]), DataParserToTypescript__namespace.printer({
                            context: buildedContext.typescriptContext,
                            importContext: buildedContext.importContext,
                        })), utils.E.isRight);
                        for (const context of createSubDataParserBuildedContext.createSubDataParserBuildedContext(buildedContext)) {
                            utils.asserts(await serverUtils.SF.writeTextFile(utils.Path.resolveRelative([
                                generateDataParserParams.outputFolder,
                                `${context.identifier}.ts`,
                            ]), dataParserTools.DataParserToDataParser.printer(context)), utils.E.isRight);
                        }
                        await utils.pipe(buildedContext.context.values(), utils.G.map((contextValue) => `export * from "./${contextValue.identifier.text}";`), utils.A.from, utils.A.join("\n"), async (values) => {
                            utils.asserts(await serverUtils.SF.writeTextFile(utils.Path.resolveRelative([
                                generateDataParserParams.outputFolder,
                                "index.ts",
                            ]), values), utils.E.isRight);
                        });
                    }
                },
            },
        ],
    });
}

exports.codeGeneratorPlugin = codeGeneratorPlugin;
