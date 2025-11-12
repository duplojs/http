import { type Route } from "@core/route";
import { type EscapeVoid, G, type MaybePromise } from "@duplojs/utils";
import { type Hub } from ".";

export type HookBeforeBuildRoute = (
	route: Route,
) => MaybePromise<Route>;

export type HookBeforeStartServer = (
	hub: Hub,
) => MaybePromise<void>;

export type HookAfterStartServer = (
	hub: Hub,
) => MaybePromise<void>;

export interface HookHubLifeCycle {
	beforeBuildRoute?: HookBeforeBuildRoute;
	beforeStartServer?: HookBeforeStartServer;
	afterStartServer?: HookAfterStartServer;
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
	hooks: Iterable<HookBeforeStartServer | HookAfterStartServer>,
	hub: Hub,
) {
	return G.asyncReduce(
		hooks,
		G.reduceFrom<EscapeVoid>(undefined),
		async({
			element: hook,
			next,
		}) => next(void await hook(hub)),
	);
}
