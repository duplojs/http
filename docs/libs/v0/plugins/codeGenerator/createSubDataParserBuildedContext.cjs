'use strict';

var utils = require('@duplojs/utils');

function createSubDataParserBuildedContext(buildedContext) {
    return utils.pipe(buildedContext.context.entries(), utils.G.map(([dataParser, contextValue]) => {
        const subImportContext = new Map(buildedContext.importContext);
        utils.pipe(contextValue.dependencies, utils.G.map((dataParserDependencies) => {
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
        }), utils.G.execute);
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
    }));
}

exports.createSubDataParserBuildedContext = createSubDataParserBuildedContext;
