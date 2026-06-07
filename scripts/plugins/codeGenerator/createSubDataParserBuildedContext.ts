import { type DataParserToTypescript, type DataParserToDataParser } from "@duplojs/data-parser-tools";
import { G, pipe } from "@duplojs/utils";

export interface SubBuildedContext extends DataParserToDataParser.BuildedContext {
	identifier: string;
}

export function createSubDataParserBuildedContext(
	buildedContext: DataParserToDataParser.BuildedContext,
) {
	return pipe(
		buildedContext.context.entries(),
		G.map(
			([dataParser, contextValue]): SubBuildedContext => {
				const subImportContext: DataParserToTypescript.MapImportContext = new Map(
					buildedContext.importContext,
				);

				pipe(
					contextValue.dependencies,
					G.map(
						(dataParserDependencies) => {
							if (dataParser === dataParserDependencies) {
								return null;
							}
							const subContextValue = buildedContext.context.get(dataParserDependencies);
							if (!subContextValue) {
								return null;
							}

							subImportContext.set(`./${subContextValue.identifier.text}`, {
								direct: [subContextValue.identifier.text],
							});

							return null;
						},
					),
					G.execute,
				);

				if (contextValue.typeIdentifier) {
					subImportContext.set("./types", {
						direct: [contextValue.typeIdentifier.text],
					});
				}

				return {
					identifier: contextValue.identifier.text,
					importContext: subImportContext,
					context: new Map([[dataParser, contextValue]]),
					importMode: buildedContext.importMode,
					typescriptContext: new Map(),
				};
			},
		),
	);
}
