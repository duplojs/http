const regexUrlAnalyser = /^(?<path>[^?]*)(?:\?(?<query>[^#]*))?(?:#(?<fragment>[^]*))?$/;
const regexQueryAnalyser = /(?<key>[^=&]+)=(?<value>[^&]*)/g;
const invalidEntryRegex = /__proto__|constructor|prototype/;
function decodeUrl(url) {
    try {
        const groups = regexUrlAnalyser.exec(url).groups;
        const path = decodeURIComponent(groups.path || "/");
        const queryString = groups.query;
        if (!queryString) {
            return {
                path,
                query: {},
            };
        }
        const query = {};
        for (const result of queryString.matchAll(regexQueryAnalyser)) {
            const groups = result.groups;
            const key = decodeURIComponent(groups.key);
            if (invalidEntryRegex.test(key)) {
                continue;
            }
            const value = decodeURIComponent(groups.value);
            const currentValue = query[key];
            if (typeof currentValue === "undefined") {
                query[key] = value;
            }
            else if (currentValue instanceof Array) {
                currentValue.push(value);
            }
            else {
                query[key] = [currentValue, value];
            }
        }
        return {
            path,
            query,
        };
    }
    catch {
        return {
            path: "/",
            query: {},
        };
    }
}

export { decodeUrl, regexQueryAnalyser, regexUrlAnalyser };
