'use strict';

var utils = require('@duplojs/utils');

function pathToRegExp(path) {
    return utils.pipe(path, utils.escapeRegExp, utils.S.replace(/\\\/$/g, ""), utils.S.replace(/\\\*/g, ".*"), utils.S.replace(/\\\{([A-zÀ-ÿ0-9_-]+)\\\}/g, "(?<$1>[A-zÀ-ÿ0-9_\\-. ]+)"), (regExp) => new RegExp(`^${regExp}\\/?$`));
}

exports.pathToRegExp = pathToRegExp;
