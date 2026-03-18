import * as DataParserToTypescript from '@duplojs/data-parser-tools/toTypescript';
import { equal, A, DP, asserts, E } from '@duplojs/utils';
import { routeToDataParser } from './routeToDataParser.mjs';
import { SF } from '@duplojs/server-utils';
import { fileTransformer, dateTransformer, timeTransformer } from './typescriptTransformer.mjs';

function codeGeneratorPlugin(pluginParams) {
    return () => ({
        name: "code-generator",
        hooksHubLifeCycle: [
            {
                beforeStartServer: async (hub) => {
                    if (!equal(hub.config.environment, ["DEV", "BUILD"])) {
                        return;
                    }
                    const routes = A.from(hub.routes);
                    const dataParserRoutes = A.flatMap(routes, (route) => routeToDataParser(route, {
                        defaultExtractContract: hub.defaultExtractContract,
                    }));
                    if (!A.minElements(dataParserRoutes, 1)) {
                        return;
                    }
                    const output = DataParserToTypescript.render(DP.union(dataParserRoutes), {
                        identifier: "Routes",
                        mode: "in",
                        transformers: [
                            fileTransformer,
                            dateTransformer,
                            timeTransformer,
                            ...DataParserToTypescript.defaultTransformers,
                        ],
                    });
                    asserts(await SF.writeTextFile(pluginParams.outputFile, output), E.isRight);
                },
            },
        ],
    });
}

export { codeGeneratorPlugin };
