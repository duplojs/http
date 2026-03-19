const starRegex = /(^|,) *\* *(?=,|$)/;
const originRegex = /(^|,) *origin *(?=,|$)/i;
const varyFunction = {
    default() {
        const maxStoreSize = 500;
        const store = new Map();
        return (request, response) => {
            const cachedVary = store.get(request.origin);
            if (cachedVary) {
                response.setHeader("vary", cachedVary);
                return;
            }
            let varyValue = Array.isArray(response.headers?.Vary)
                ? response.headers.Vary.join(", ")
                : response.headers?.Vary;
            if (varyValue === undefined) {
                varyValue = "Origin";
            }
            else if (starRegex.test(varyValue)) {
                varyValue = "*";
            }
            else if (!originRegex.test(varyValue)) {
                varyValue = `${varyValue}, Origin`;
            }
            if (store.size < maxStoreSize) {
                store.set(request.origin, varyValue);
            }
            response.setHeader("vary", varyValue);
        };
    },
};

export { varyFunction };
