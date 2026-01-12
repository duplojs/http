import * as DataParserToTypescript from "@duplojs/data-parser-tools/toTypescript";
import { type HubPlugin } from "@core/hub";
import { A, DP } from "@duplojs/utils";
import { routeToDataParser } from "./routeToDataParser";
import { writeFile } from "node:fs/promises";

export interface CodeGeneratorPluginParams {
	outputFile: string;
}

export function codeGeneratorPlugin(pluginParams: CodeGeneratorPluginParams) {
	return (): HubPlugin => ({
		name: "code-generator",
		hooksHubLifeCycle: [
			{
				beforeStartServer: async(hub) => {
					const routes = hub.aggregatesRoutes();

					const dataParserRoutes = A.map(
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
							transformers: DataParserToTypescript.defaultTransformers,

						},
					);

					await writeFile(pluginParams.outputFile, output);
				},
			},
		],
	});
}
