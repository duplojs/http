import { pipe, escapeRegExp, S } from '@duplojs/utils';

function pathToRegExp(path) {
    return pipe(path, escapeRegExp, S.replace(/\\\/$/g, ""), S.replace(/\\\*/g, ".*"), S.replace(/\\\{([A-zÀ-ÿ0-9_-]+)\\\}/g, "(?<$1>[A-zÀ-ÿ0-9_\\-. ]+)"), (regExp) => new RegExp(`^${regExp}\\/?$`));
}

export { pathToRegExp };
