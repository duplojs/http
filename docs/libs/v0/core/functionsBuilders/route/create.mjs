import { E } from '@duplojs/utils';

function createRouteFunctionBuilder(support, builder) {
    return (route, params) => support(route)
        ? builder(route, params)
        : Promise.resolve(E.left("routeNotSupport", route));
}

export { createRouteFunctionBuilder };
