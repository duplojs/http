async function buildRouterFunction({ routerFunctionBuilder, ...params }) {
    return routerFunctionBuilder(params);
}

export { buildRouterFunction };
