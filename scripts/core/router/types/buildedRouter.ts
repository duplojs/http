import { type createStepFunctionBuilder, type createRouteFunctionBuilder } from "@core/functionsBuilders";
import { type HookHubLifeCycle } from "@core/hub";
import { type RequestInitializationData } from "@core/request";
import { type HookRouteLifeCycle, type Route, type RouteDefinition } from "@core/route";

export interface BuildedRouter {
	exec(
		initializationData: Omit<
			RequestInitializationData,
			| "matchedPath"
			| "params"
			| "path"
			| "query"
		>
	): Promise<void>;
	readonly routes: readonly Route<RouteDefinition>[];
	readonly hooksRouteLifeCycle: readonly HookRouteLifeCycle[];
	readonly routeFunctionBuilders: readonly ReturnType<typeof createRouteFunctionBuilder>[];
	readonly stepFunctionBuilders: readonly ReturnType<typeof createStepFunctionBuilder>[];
	readonly hooksHubLifeCycle: readonly HookHubLifeCycle[];

}

