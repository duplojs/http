import * as DataParserToTypescript from '@duplojs/data-parser-tools/toTypescript';
import { equal, pipe, G, A, DP, asserts, E, asyncPipe, Path } from '@duplojs/utils';
import { routeToDataParser } from './routeToDataParser.mjs';
import { SF } from '@duplojs/server-utils';
import { typescriptTransformers } from './typescriptTransformer.mjs';
import { dataParserHasIdentifier, findIdentifiedDataParserInSteps } from './findIdentifiedDataParserInSteps.mjs';
import { DataParserFinder, DataParserToDataParser } from '@duplojs/data-parser-tools';
import { createSubDataParserBuildedContext } from './createSubDataParserBuildedContext.mjs';

function codeGeneratorPlugin(pluginParams) {
    return () => ({
        name: "code-generator",
        hooksHubLifeCycle: [
            {
                beforeStartServer: async (hub) => {
                    if (!equal(hub.config.environment, ["DEV", "BUILD"])) {
                        return;
                    }
                    const dataParserRoutes = pipe(hub.routes, G.map((route) => routeToDataParser(route, {
                        defaultExtractContract: hub.defaultExtractContract,
                    })), G.flat, A.from);
                    if (!A.minElements(dataParserRoutes, 1)) {
                        return;
                    }
                    const output = DataParserToTypescript.render(DP.union(dataParserRoutes), {
                        identifier: "Routes",
                        mode: "in",
                        transformers: typescriptTransformers,
                    });
                    asserts(await SF.writeTextFile(pluginParams.outputFile, output), E.isRight);
                    if (pluginParams.generateDataParser) {
                        const generateDataParserParams = pluginParams.generateDataParser;
                        const buildedContext = {
                            context: new Map(),
                            importContext: new Map(),
                            typescriptContext: new Map(),
                            importMode: "lite",
                        };
                        const ignoreDataParser = new Set();
                        pipe([], A.concat(pipe(generateDataParserParams.dataParsers ?? [], A.flatMap((dataParser) => DataParserFinder.dataParserFinder(dataParser, dataParserHasIdentifier, {
                            researchers: DataParserFinder.defaultResearchers,
                            ignore: ignoreDataParser,
                        })))), A.concat(pipe(generateDataParserParams.disabledFromRoute
                            ? new Set()
                            : hub.routes, G.map((route) => findIdentifiedDataParserInSteps(route.definition.steps, { ignoreDataParser })), G.flat, A.from)), A.map((dataParser) => DataParserToDataParser.buildContext(dataParser, {
                            identifier: dataParser.definition.identifier,
                            checkerTransformers: DataParserToDataParser.defaultCheckerTransformers,
                            dataParserTransformers: DataParserToDataParser.defaultTransformers,
                            typescriptTransformers: DataParserToTypescript.defaultTransformers,
                            ...buildedContext,
                        })));
                        await asyncPipe(SF.exists(generateDataParserParams.outputFolder), E.whenIsRight(async () => void asserts(await SF.remove(generateDataParserParams.outputFolder, { recursive: true }), E.isRight)), async () => void asserts(await SF.makeDirectory(generateDataParserParams.outputFolder), E.isRight));
                        asserts(await SF.writeTextFile(Path.resolveRelative([
                            generateDataParserParams.outputFolder,
                            "types.ts",
                        ]), DataParserToTypescript.printer({
                            context: buildedContext.typescriptContext,
                            importContext: buildedContext.importContext,
                        })), E.isRight);
                        for (const context of createSubDataParserBuildedContext(buildedContext)) {
                            asserts(await SF.writeTextFile(Path.resolveRelative([
                                generateDataParserParams.outputFolder,
                                `${context.identifier}.ts`,
                            ]), DataParserToDataParser.printer(context)), E.isRight);
                        }
                        await pipe(buildedContext.context.values(), G.map((contextValue) => `export * from "./${contextValue.identifier.text}";`), A.from, A.join("\n"), async (values) => {
                            asserts(await SF.writeTextFile(Path.resolveRelative([
                                generateDataParserParams.outputFolder,
                                "index.ts",
                            ]), values), E.isRight);
                        });
                    }
                },
            },
        ],
    });
}

export { codeGeneratorPlugin };
