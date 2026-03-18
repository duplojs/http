'use strict';

var utils = require('@duplojs/utils');
var serverUtils = require('@duplojs/server-utils');
var kind = require('./kind.cjs');
var makeRouteFile = require('./makeRouteFile.cjs');
var makeRouteFolder = require('./makeRouteFolder.cjs');

class StaticPluginError extends utils.kindHeritage("static-plugin", kind.createStaticPluginKind("static-plugin"), Error) {
    information;
    error;
    constructor(information, error) {
        super({}, [`Error during registration static route: ${information}`]);
        this.information = information;
        this.error = error;
    }
}
function staticPlugin(...args) {
    const route = utils.P.match(args)
        .with([utils.toCurriedPredicate(serverUtils.SF.isFolderInterface)], ([source, params]) => makeRouteFolder.makeRouteFolder({
        source,
        ...params,
    }))
        .with([utils.toCurriedPredicate(serverUtils.SF.isFileInterface)], ([source, params]) => makeRouteFile.makeRouteFile({
        source,
        ...params,
    }))
        .exhaustive();
    return {
        name: "static",
        routes: [route],
        hooksHubLifeCycle: [
            {
                beforeStartServer: async () => {
                    const statResult = await args[0].stat();
                    if (utils.E.isLeft(statResult)) {
                        throw new StaticPluginError(`source does not exit (${args[0].path}).`, utils.unwrap(statResult));
                    }
                    const stat = utils.unwrap(statResult);
                    if (serverUtils.SF.isFileInterface(args[0]) && !stat.isFile) {
                        throw new StaticPluginError(`source does not file (${args[0].path}).`, stat);
                    }
                    else if (serverUtils.SF.isFolderInterface(args[0]) && stat.isFile) {
                        throw new StaticPluginError(`source does not folder (${args[0].path}).`, stat);
                    }
                },
            },
        ],
    };
}

exports.StaticPluginError = StaticPluginError;
exports.staticPlugin = staticPlugin;
