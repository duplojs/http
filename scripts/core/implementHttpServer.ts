
import { type Hub, launchHookServer, launchHookServerError, serverErrorExitHookFunction, serverErrorNextHookFunction } from "./hub";
import { buildRouter, type RouterInitializationData } from "./router";
import { forward, type MaybePromise } from "@duplojs/utils";
import { type HttpServerParams } from "./types";
import { initDefaultHook } from "./defaultHooks";

export interface ImplementHttpServerParams {
	readonly hub: Hub;
	readonly httpServerParams: HttpServerParams;
}

export type ExecRouteSystem = (
	routerInitializationData: RouterInitializationData,
	whenUncaughtError: (
		error: unknown,
		routerInitializationData: RouterInitializationData
	) => MaybePromise<void>
) => Promise<void>;

export interface InitHttpServerParams {
	readonly execRouteSystem: ExecRouteSystem;
	readonly httpServerParams: HttpServerParams;
}

export async function implementHttpServer<
	GenericServer extends unknown,
>(
	params: ImplementHttpServerParams,
	initHttpServer: (params: InitHttpServerParams) => MaybePromise<GenericServer>,
): Promise<GenericServer> {
	await launchHookServer(
		params.hub.aggregatesHooksHubLifeCycle("beforeServerBuildRoutes"),
		params.hub,
		params.httpServerParams,
	);

	const router = await buildRouter(
		params.hub,
	);

	await launchHookServer(
		params.hub.aggregatesHooksHubLifeCycle("beforeStartServer"),
		params.hub,
		params.httpServerParams,
	);

	const serverErrorHooks = params.hub.aggregatesHooksHubLifeCycle("serverError");

	function catchCriticalError(error: unknown) {
		console.error("Critical Error :", error);
	}

	const execRouteSystem: ExecRouteSystem = (
		routerInitializationData,
		whenUncaughtError,
	) => router
		.exec(routerInitializationData)
		.catch(async(error: unknown) => {
			await launchHookServerError(serverErrorHooks, {
				error,
				exit: serverErrorExitHookFunction,
				next: serverErrorNextHookFunction,
				routerInitializationData: routerInitializationData,
			}).catch(forward);

			await whenUncaughtError(error, routerInitializationData);
		})
		.catch(catchCriticalError);

	const result = await initHttpServer({
		execRouteSystem: execRouteSystem,
		httpServerParams: params.httpServerParams,
	});

	await launchHookServer(
		params.hub.aggregatesHooksHubLifeCycle("afterStartServer"),
		params.hub,
		params.httpServerParams,
	);

	return result;
}
