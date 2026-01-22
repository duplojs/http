'use strict';

var stringIdentifier = require('../../stringIdentifier.cjs');
var utils = require('@duplojs/utils');

const SymbolRouteStore = Symbol.for(stringIdentifier.createCoreLibStringIdentifier("route-store"));
const privateRouteStore = utils.createGlobalStore(SymbolRouteStore, new Set());
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

exports.routeStore = routeStore;
