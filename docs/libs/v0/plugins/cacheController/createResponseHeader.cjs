'use strict';

var utils = require('@duplojs/utils');

function createCacheControlResponseHeader(directives) {
    return utils.pipe([
        utils.O.entry("max-age", directives.maxAge),
        utils.O.entry("s-maxage", directives.sMaxAge),
        utils.O.entry("public", directives.public),
        utils.O.entry("private", directives.private),
        utils.O.entry("no-cache", directives.noCache),
        utils.O.entry("no-store", directives.noStore),
        utils.O.entry("no-transform", directives.noTransform),
        utils.O.entry("must-revalidate", directives.mustRevalidate),
        utils.O.entry("proxy-revalidate", directives.proxyRevalidate),
        utils.O.entry("immutable", directives.immutable),
        utils.O.entry("stale-while-revalidate", directives.staleWhileRevalidate),
        utils.O.entry("stale-if-error", directives.staleIfError),
        utils.O.entry("must-understand", directives.mustUnderstand),
    ], utils.A.concat(directives.extensions ? utils.O.entries(directives.extensions) : []), utils.A.reduce(utils.A.reduceFrom([]), ({ element: [key, value], lastValue, nextPush, next }) => {
        if (value === true) {
            return nextPush(lastValue, key);
        }
        else if (typeof value === "number"
            && Number.isFinite(value)
            && value >= 0) {
            return nextPush(lastValue, `${key}=${Math.trunc(value)}`);
        }
        else if (value instanceof Array
            && utils.A.minElements(value, 1)) {
            return nextPush(lastValue, `${key}="${utils.A.join(value, ",")}"`);
        }
        else if (value !== ""
            && typeof value === "string") {
            return nextPush(lastValue, `${key}="${value}"`);
        }
        else {
            return next(lastValue);
        }
    }), utils.A.join(","));
}

exports.createCacheControlResponseHeader = createCacheControlResponseHeader;
