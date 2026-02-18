'use strict';

var DataParserToTypescript = require('@duplojs/data-parser-tools/toTypescript');
var utils = require('@duplojs/utils');
var routeToDataParser = require('./routeToDataParser.cjs');
var serverUtils = require('@duplojs/server-utils');
var typescriptTransfomer = require('./typescriptTransfomer.cjs');

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
                    const routes = utils.A.from(hub.routes);
                    const dataParserRoutes = utils.A.flatMap(routes, (route) => routeToDataParser.routeToDataParser(route, {
                        defaultExtractContract: hub.defaultExtractContract,
                    }));
                    if (!utils.A.minElements(dataParserRoutes, 1)) {
                        return;
                    }
                    const output = DataParserToTypescript__namespace.render(utils.DP.union(dataParserRoutes), {
                        identifier: "Routes",
                        transformers: [
                            typescriptTransfomer.fileTransformer,
                            ...DataParserToTypescript__namespace.defaultTransformers,
                        ],
                    });
                    utils.asserts(await serverUtils.SF.writeTextFile(pluginParams.outputFile, output), utils.E.isRight);
                },
            },
        ],
    });
}

exports.codeGeneratorPlugin = codeGeneratorPlugin;
