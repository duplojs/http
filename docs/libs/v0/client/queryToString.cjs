'use strict';

function queryToString(query) {
    if (!query) {
        return null;
    }
    return Object.entries(query)
        .reduce((pv, [key, value]) => {
        if (!value) {
            return pv;
        }
        if (value instanceof Array) {
            value.forEach((subValue) => {
                pv.push(`${key}=${subValue}`);
            });
        }
        else {
            pv.push(`${key}=${value}`);
        }
        return pv;
    }, [])
        .join("&") || null;
}

exports.queryToString = queryToString;
