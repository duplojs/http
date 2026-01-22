import { createCoreLibStringIdentifier } from '../../stringIdentifier.mjs';
import { createGlobalStore } from '@duplojs/utils';

const SymbolRouteStore = Symbol.for(createCoreLibStringIdentifier("route-store"));
const privateRouteStore = createGlobalStore(SymbolRouteStore, new Set());
const routeStore = {
    add(route) {
        privateRouteStore.value.add(route);
    },
    *getAll() {
        for (const route of privateRouteStore.value) {
            yield route;
        }
    },
};

export { routeStore };
