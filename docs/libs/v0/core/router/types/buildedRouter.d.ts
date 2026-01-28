import { type createStepFunctionBuilder, type createRouteFunctionBuilder } from "../../functionsBuilders";
import { type HookHubLifeCycle } from "../../hub";
import { type RequestInitializationData } from "../../request";
import { type HookRouteLifeCycle, type Route, type RouteDefinition } from "../../route";
export type RouterInitializationData = Omit<RequestInitializationData, "matchedPath" | "params" | "path" | "query">;
export interface BuildedRouter {
    exec(initializationData: RouterInitializationData): Promise<void>;
    readonly routes: readonly Route<RouteDefinition>[];
    readonly hooksRouteLifeCycle: readonly HookRouteLifeCycle[];
    readonly routeFunctionBuilders: readonly ReturnType<typeof createRouteFunctionBuilder>[];
    readonly stepFunctionBuilders: readonly ReturnType<typeof createStepFunctionBuilder>[];
    readonly hooksHubLifeCycle: readonly HookHubLifeCycle[];
}
