
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
	const newHub1 = await launchHookServer(
		params
			.hub
			.addRouteHooks(initDefaultHook(params.hub, params.httpServerParams))
			.aggregatesHooksHubLifeCycle("beforeServerBuildRoutes"),
		params.hub,
		params.httpServerParams,
	);

	const router = await buildRouter(
		newHub1,
	);

	const newHub2 = await launchHookServer(
		newHub1.aggregatesHooksHubLifeCycle("beforeStartServer"),
		newHub1,
		params.httpServerParams,
	);

	const serverErrorHooks = newHub1.aggregatesHooksHubLifeCycle("serverError");

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
		newHub2.aggregatesHooksHubLifeCycle("afterStartServer"),
		newHub2,
		params.httpServerParams,
	);

	return result;
}
