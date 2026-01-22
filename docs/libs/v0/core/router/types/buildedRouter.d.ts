import { type createStepFunctionBuilder, type createRouteFunctionBuilder } from "../../functionsBuilders";
import { type HookHubLifeCycle } from "../../hub";
import { type RequestInitializationData } from "../../request";
import { type HookRouteLifeCycle, type Route, type RouteDefinition } from "../../route";
export interface BuildedRouter {
    exec(initializationData: Omit<RequestInitializationData, "matchedPath" | "params" | "path" | "query">): Promise<void>;
    readonly routes: readonly Route<RouteDefinition>[];
    readonly hooksRouteLifeCycle: readonly HookRouteLifeCycle[];
    readonly routeFunctionBuilders: readonly ReturnType<typeof createRouteFunctionBuilder>[];
    readonly stepFunctionBuilders: readonly ReturnType<typeof createStepFunctionBuilder>[];
    readonly hooksHubLifeCycle: readonly HookHubLifeCycle[];
}
