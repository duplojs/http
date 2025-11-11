import { type Route } from "@core/route";
import { G, type MaybePromise } from "@duplojs/utils";

export type HookBeforeBuildRoute = (
	route: Route,
) => MaybePromise<Route>;

export interface HookHubLifeCycle {
	beforeBuildRoute?: HookBeforeBuildRoute;
}

export async function launchBeforeBuildRoute(
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
