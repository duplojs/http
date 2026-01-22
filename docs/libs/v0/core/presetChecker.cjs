'use strict';

var utils = require('@duplojs/utils');
var kind = require('./kind.cjs');

const presetCheckerKind = kind.createCoreLibKind("preset-checker");
function createPresetChecker(checker, { otherwise, ...definition }) {
    return utils.pipe({
        definition: {
            ...definition,
            checker,
            responseContract: otherwise,
        },
        indexing(indexing) {
            return createPresetChecker(checker, {
                ...definition,
                indexing,
                otherwise,
            });
        },
        rewriteInput(rewriteInput) {
            return createPresetChecker(checker, {
                ...definition,
                rewriteInput,
                otherwise,
            });
        },
        options(options) {
            return createPresetChecker(checker, {
                ...definition,
                options,
                otherwise,
            });
        },
    }, presetCheckerKind.setTo);
}

exports.createPresetChecker = createPresetChecker;
exports.presetCheckerKind = presetCheckerKind;
