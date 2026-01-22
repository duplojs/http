import * as DataParserToTypescript from '@duplojs/data-parser-tools/toTypescript';
import { A, DP } from '@duplojs/utils';
import { routeToDataParser } from './routeToDataParser.mjs';
import { writeFile } from 'node:fs/promises';

function codeGeneratorPlugin(pluginParams) {
    return () => ({
        name: "code-generator",
        hooksHubLifeCycle: [
            {
                beforeStartServer: async (hub) => {
                    const routes = hub.aggregatesRoutes();
                    const dataParserRoutes = A.flatMap(routes, (route) => routeToDataParser(route, {
                        defaultExtractContract: hub.defaultExtractContract,
                    }));
                    if (!A.minElements(dataParserRoutes, 1)) {
                        return;
                    }
                    const output = DataParserToTypescript.render(DP.union(dataParserRoutes), {
                        identifier: "Routes",
                        transformers: DataParserToTypescript.defaultTransformers,
                    });
                    await writeFile(pluginParams.outputFile, output);
                },
            },
        ],
    });
}

export { codeGeneratorPlugin };
