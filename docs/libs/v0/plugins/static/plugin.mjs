import { kindHeritage, P, toCurriedPredicate, E, unwrap } from '@duplojs/utils';
import { SF } from '@duplojs/server-utils';
import { createStaticPluginKind } from './kind.mjs';
import { makeRouteFile } from './makeRouteFile.mjs';
import { makeRouteFolder } from './makeRouteFolder.mjs';

class StaticPluginError extends kindHeritage("static-plugin", createStaticPluginKind("static-plugin"), Error) {
    information;
    error;
    constructor(information, error) {
        super({}, [`Error during registration static route: ${information}`]);
        this.information = information;
        this.error = error;
    }
}
function staticPlugin(...args) {
    const route = P.match(args)
        .with([toCurriedPredicate(SF.isFolderInterface)], ([source, params]) => makeRouteFolder({
        source,
        ...params,
    }))
        .with([toCurriedPredicate(SF.isFileInterface)], ([source, params]) => makeRouteFile({
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
                    if (E.isLeft(statResult)) {
                        throw new StaticPluginError(`source does not exit (${args[0].path}).`, unwrap(statResult));
                    }
                    const stat = unwrap(statResult);
                    if (SF.isFileInterface(args[0]) && !stat.isFile) {
                        throw new StaticPluginError(`source does not file (${args[0].path}).`, stat);
                    }
                    else if (SF.isFolderInterface(args[0]) && stat.isFile) {
                        throw new StaticPluginError(`source does not folder (${args[0].path}).`, stat);
                    }
                },
            },
        ],
    };
}

export { StaticPluginError, staticPlugin };
