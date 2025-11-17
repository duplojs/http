import { type BuildElementParams, type createFunctionBuilder } from "@core/functionBuilder";
import { type HookHubLifeCycle } from "@core/hub";
import { type Process } from "@core/process";
import { type RequestInitializationData } from "@core/request";
import { type HookRouteLifeCycle, type Route, type RouteDefinition } from "@core/route";

export interface BuildedRouter {
	exec(
		initializationData: Pick<
			RequestInitializationData,
		| "headers"
		| "host"
		| "method"
		| "origin"
		| "path"
		| "query"
		| "url"
		>
	): Promise<void>;
	readonly routes: readonly Route<RouteDefinition>[];
	readonly processFunctionBuilders: readonly ReturnType<typeof createFunctionBuilder<Process>>[];
	readonly hooksRouteLifeCycle: readonly HookRouteLifeCycle[];
	readonly routeFunctionBuilders: readonly ReturnType<typeof createFunctionBuilder<Route>>[];
	readonly stepFunctionBuilders: BuildElementParams["stepFunctionBuilders"];
	readonly hooksHubLifeCycle: readonly HookHubLifeCycle[];

}

