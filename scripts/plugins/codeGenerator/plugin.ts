import * as DataParserToTypescript from "@duplojs/data-parser-tools/toTypescript";
import { type HubPlugin } from "@core/hub";
import { A, asserts, DP, E, equal } from "@duplojs/utils";
import { routeToDataParser } from "./routeToDataParser";
import { SF } from "@duplojs/server-utils";
import { dateTransformer, fileTransformer, timeTransformer } from "./typescriptTransfomer";

export interface CodeGeneratorPluginParams {
	outputFile: string;
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

					const routes = A.from(hub.routes);

					const dataParserRoutes = A.flatMap(
						routes,
						(route) => routeToDataParser(route, {
							defaultExtractContract: hub.defaultExtractContract,
						}),
					);

					if (!A.minElements(dataParserRoutes, 1)) {
						return;
					}

					const output = DataParserToTypescript.render(
						DP.union(dataParserRoutes),
						{
							identifier: "Routes",
							mode: "in",
							transformers: [
								fileTransformer,
								dateTransformer,
								timeTransformer,
								...DataParserToTypescript.defaultTransformers,
							],
						},
					);

					asserts(
						await SF.writeTextFile(pluginParams.outputFile, output),
						E.isRight,
					);
				},
			},
		],
	});
}
