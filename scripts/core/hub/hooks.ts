import { type Route } from "@core/route";
import { type EscapeVoid, G, type MaybePromise } from "@duplojs/utils";
import { type Hub } from ".";

export type HookBeforeBuildRoute = (
	route: Route,
) => MaybePromise<Route>;

export interface HttpServerParams {

}

export type HookBeforeServerBuildRoute = (
	hub: Hub,
	httpServerParams: HttpServerParams
) => MaybePromise<Hub | EscapeVoid>;

export type HookBeforeStartServer = (
	hub: Hub,
	httpServerParams: HttpServerParams
) => MaybePromise<Hub | EscapeVoid>;

export type HookAfterStartServer = (
	hub: Hub,
	httpServerParams: HttpServerParams
) => MaybePromise<Hub | EscapeVoid>;

export interface HookHubLifeCycle {
	beforeBuildRoute?: HookBeforeBuildRoute;
	beforeStartServer?: HookBeforeStartServer;
	afterStartServer?: HookAfterStartServer;
	beforeServerBuildRoute?: HookBeforeServerBuildRoute;
}

export async function launchHookBeforeBuildRoute(
	hooks: Iterable<HookBeforeBuildRoute>,
	route: Route,
) {
	return G.asyncReduce(
		hooks,
		G.reduceFrom(route),
		async({
			element: hook,
			lastValue,
			next,
		}) => next(await hook(lastValue)),
	);
}

export async function launchHookServer(
	hooks: Iterable<HookBeforeStartServer | HookAfterStartServer | HookBeforeServerBuildRoute>,
	hub: Hub,
	httpServerParams: HttpServerParams,
) {
	return G.asyncReduce(
		hooks,
		G.reduceFrom(hub),
		async({
			element: hook,
			lastValue,
			next,
		}) => next(
			await hook(lastValue, httpServerParams) ?? lastValue,
		),
	);
}
