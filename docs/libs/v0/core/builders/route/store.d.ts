import { type Route } from "../../route";
declare const SymbolRouteStore: unique symbol;
declare module "@duplojs/utils" {
    interface GlobalStore {
        [SymbolRouteStore]: Set<Route>;
    }
}
export interface RouteStore {
    add(route: Route): void;
    getAll(): Generator<Route>;
}
export declare const routeStore: RouteStore;
export {};
