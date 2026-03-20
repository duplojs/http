'use strict';

/**
 * @internal
 */
function findPairEndIndex(value, start, len) {
    const index = value.indexOf(";", start);
    return index === -1 ? len : index;
}
/**
 * @internal
 */
function sliceAndTrimOws(value, min, max) {
    if (min === max) {
        return "";
    }
    let start = min;
    let end = max;
    do {
        const code = value.charCodeAt(start);
        if (code !== 32 /*   */ && code !== 9 /* \t */) {
            break;
        }
    } while (++start < end);
    while (end > start) {
        const code = value.charCodeAt(end - 1);
        if (code !== 32 /*   */ && code !== 9 /* \t */) {
            break;
        }
        end--;
    }
    return value.slice(start, end);
}
/**
 * @internal
 */
function decode(value) {
    if (!value.includes("%")) {
        return value;
    }
    try {
        return decodeURIComponent(value);
    }
    catch {
        return value;
    }
}
function defaultParser(value) {
    const result = Object.create(null);
    const valueLength = value.length;
    if (valueLength < 2) {
        return result;
    }
    let index = 0;
    do {
        const equalCharIndex = value.indexOf("=", index);
        if (equalCharIndex === -1) {
            break;
        }
        const pairEndIndex = findPairEndIndex(value, index, valueLength);
        if (equalCharIndex > pairEndIndex) {
            index = value.lastIndexOf(";", equalCharIndex - 1) + 1;
            continue;
        }
        const key = sliceAndTrimOws(value, index, equalCharIndex);
        if (key === "") {
            index = pairEndIndex + 1;
            continue;
        }
        if (result[key] === undefined) {
            result[key] = decode(sliceAndTrimOws(value, equalCharIndex + 1, pairEndIndex));
        }
        index = pairEndIndex + 1;
    } while (index < valueLength);
    return result;
}

exports.decode = decode;
exports.defaultParser = defaultParser;
exports.findPairEndIndex = findPairEndIndex;
exports.sliceAndTrimOws = sliceAndTrimOws;
