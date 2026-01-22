import { pipe } from '@duplojs/utils';
import { createCoreLibKind } from './kind.mjs';

const presetCheckerKind = createCoreLibKind("preset-checker");
function createPresetChecker(checker, { otherwise, ...definition }) {
    return pipe({
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

export { createPresetChecker, presetCheckerKind };
