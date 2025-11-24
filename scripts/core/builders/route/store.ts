import { type Route } from "@core/route";
import { createCoreLibStringIdentifier } from "@core/stringIdentifier";
import { createGlobalStore } from "@duplojs/utils";

const SymbolRouteStore = Symbol.for(
	createCoreLibStringIdentifier("route-store"),
);

declare module "@duplojs/utils" {
	interface GlobalStore {
		[SymbolRouteStore]: Set<Route>;
	}
}

export interface RouteStore {
	add(route: Route): void;
	getAll(): Generator<Route>;
}

const privateRouteStore = createGlobalStore(SymbolRouteStore, new Set());

export const routeStore: RouteStore = {
	add(route) {
		privateRouteStore.value.add(route);
	},
	*getAll() {
		for (const route of privateRouteStore.value) {
			yield route;
		}
	},
};
