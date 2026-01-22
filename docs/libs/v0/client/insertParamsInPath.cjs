'use strict';

function insertParamsInPath(path, params) {
    if (!params) {
        return path;
    }
    return Object.entries(params).reduce((pv, [key, value]) => value
        ? pv.replace(`{${key}}`, value.toString())
        : pv, path);
}

exports.insertParamsInPath = insertParamsInPath;
