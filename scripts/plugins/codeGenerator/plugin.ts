import * as DataParserToTypescript from "@duplojs/data-parser-tools/toTypescript";
import { type HubPlugin } from "@core/hub";
import { A, asserts, DP, E, equal, G, Path, pipe } from "@duplojs/utils";
import { routeToDataParser } from "./routeToDataParser";
import { SF } from "@duplojs/server-utils";
import { typescriptTransformers } from "./typescriptTransformer";
import { dataParserHasIdentifier, findIdentifiedDataParserInSteps } from "./findIdentifiedDataParserInSteps";
import { DataParserFinder, DataParserToDataParser } from "@duplojs/data-parser-tools";
import { type Route } from "@core/route";

export interface GenerateDataParserParams {
	outputFolder: string;
	disabledFromRoute?: boolean;
	dataParsers?: DP.DataParser[];
}

export interface CodeGeneratorPluginParams {
	outputFile: string;
	generateDataParser?: GenerateDataParserParams;
}

export function codeGeneratorPlugin(pluginParams: CodeGeneratorPluginParams) {
	return (): HubPlugin => ({
		name: "code-generator",
		hooksHubLifeCycle: [
			{
				beforeStartServer: async(hub) => {
					if (!equal(hub.config.environment, ["DEV", "BUILD"])) {
						return;
					}

					const dataParserRoutes = pipe(
						hub.routes,
						G.map((route) => routeToDataParser(route, {
							defaultExtractContract: hub.defaultExtractContract,
						})),
						G.flat,
						A.from,
					);

					if (!A.minElements(dataParserRoutes, 1)) {
						return;
					}

					const output = DataParserToTypescript.render(
						DP.union(dataParserRoutes),
						{
							identifier: "Routes",
							mode: "in",
							transformers: typescriptTransformers,
						},
					);

					asserts(
						await SF.writeTextFile(pluginParams.outputFile, output),
						E.isRight,
					);

					if (pluginParams.generateDataParser) {
						const generateDataParserParams = pluginParams.generateDataParser;

						const buildedContext: DataParserToDataParser.BuildedContext = {
							context: new Map(),
							importContext: new Map(),
							typescriptContext: new Map(),
							importMode: "lite",
						};
						const ignoreDataParser = new Set<DP.DataParser>();

						pipe(
							[],
							A.concat(
								pipe(
									generateDataParserParams.dataParsers ?? [],
									A.flatMap(
										(dataParser) => DataParserFinder.dataParserFinder(
											dataParser,
											dataParserHasIdentifier,
											{
												researchers: DataParserFinder.defaultResearchers,
												ignore: ignoreDataParser,
											},
										),
									),
								),
							),
							A.concat(
								pipe(
									generateDataParserParams.disabledFromRoute
										? new Set<Route>()
										: hub.routes,
									G.map(
										(route) => findIdentifiedDataParserInSteps(
											route.definition.steps,
											{ ignoreDataParser },
										),
									),
									G.flat,
									A.from,
								),
							),
							A.map(
								(dataParser) => DataParserToDataParser.buildContext(
									dataParser,
									{
										identifier: dataParser.definition.identifier,
										checkerTransformers: DataParserToDataParser.defaultCheckerTransformers,
										dataParserTransformers: DataParserToDataParser.defaultTransformers,
										typescriptTransformers: DataParserToTypescript.defaultTransformers,
										...buildedContext,
									},
								),
							),
						);

						asserts(
							await SF.writeTextFile(
								Path.resolveRelative([
									generateDataParserParams.outputFolder,
									"types.ts",
								]),
								DataParserToTypescript.printer({
									context: buildedContext.typescriptContext,
									importContext: buildedContext.importContext,
								}),
							),
							E.isRight,
						);

						await pipe(
							buildedContext.context.entries(),
							G.map(
								([dataParser, contextValue]) => {
									const subImportContext: DataParserToTypescript.MapImportContext = new Map(
										buildedContext.importContext,
									);

									pipe(
										contextValue.dependencies,
										G.map(
											(dataParser) => {
												const subContextValue = buildedContext.context.get(dataParser);
												if (!subContextValue) {
													return null;
												}

												subImportContext.set(`./${subContextValue.identifier.text}`, {
													direct: [subContextValue.identifier.text],
												});

												return null;
											},
										),
									);

									if (contextValue.typeIdentifier) {
										subImportContext.set("./types", {
											direct: [contextValue.typeIdentifier.text],
										});
									}

									return {
										fileName: `${contextValue.identifier.text}.ts`,
										importContext: subImportContext,
										context: new Map([[dataParser, contextValue]]),
										importMode: buildedContext.importMode,
										typescriptContext: new Map(),
									};
								},
							),
							G.asyncMap(
								async(context) => {
									asserts(
										await SF.writeTextFile(
											Path.resolveRelative([
												generateDataParserParams.outputFolder,
												context.fileName,
											]),
											DataParserToDataParser.printer(
												context,
											),
										),
										E.isRight,
									);
								},
							),
						);
					}
				},
			},
		],
	});
}
