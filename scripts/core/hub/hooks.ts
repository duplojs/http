import { type Route } from "@core/route";
import { type EscapeVoid, G, type Kind, type MaybePromise } from "@duplojs/utils";
import { type Hub } from ".";
import { createCoreLibKind } from "@core/kind";
import { type RouterInitializationData } from "@core/router";

export const hookServerExitKind = createCoreLibKind("server-hook-exit");

export interface ServerHookExit extends Kind<typeof hookServerExitKind.definition> {

}

export const hookServerNextKind = createCoreLibKind("server-hook-next");

export interface ServerHookNext extends Kind<typeof hookServerNextKind.definition> {

}

export type HookBeforeBuildRoute = (
	route: Route,
) => MaybePromise<Route>;

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

export interface HttpServerParams {

}

export type HookBeforeServerBuildRoutes = (
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

export async function launchHookServer(
	hooks: Iterable<HookBeforeStartServer | HookAfterStartServer | HookBeforeServerBuildRoutes>,
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
			(await hook(lastValue, httpServerParams)) ?? lastValue,
		),
	);
}

export interface HttpServerErrorParams {
	readonly error: unknown;
	next(): ServerHookNext;
	exit(): ServerHookExit;
	routerInitializationData: RouterInitializationData;
}

export type HookServerError = (
	httpServerErrorParams: HttpServerErrorParams
) => MaybePromise<ServerHookExit | ServerHookNext>;

const hookExit = hookServerExitKind.setTo({});
const hookNext = hookServerNextKind.setTo({});

export function serverErrorExitHookFunction() {
	return hookExit;
}

export function serverErrorNextHookFunction() {
	return hookNext;
}

export async function launchHookServerError(
	hooks: readonly HookServerError[],
	params: HttpServerErrorParams,
) {
	// eslint-disable-next-line @typescript-eslint/prefer-for-of
	for (let index = 0; index < hooks.length; index++) {
		const result = await hooks[index]!(params);

		if (hookServerExitKind.has(result)) {
			return;
		}
	}
}

export interface HookHubLifeCycle {
	beforeBuildRoute?: HookBeforeBuildRoute;
	beforeStartServer?: HookBeforeStartServer;
	afterStartServer?: HookAfterStartServer;
	beforeServerBuildRoutes?: HookBeforeServerBuildRoutes;
	serverError?: HookServerError;
}

export function createHookHubLifeCycle(
	hookHubLifeCycle: HookHubLifeCycle,
) {
	return hookHubLifeCycle;
}
