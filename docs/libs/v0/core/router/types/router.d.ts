import { type createRouteFunctionBuilder, type createStepFunctionBuilder } from "../../functionsBuilders";
import { type HookHubLifeCycle } from "../../hub";
import { type HookRouteLifeCycle, type Route } from "../../route";
import { type BuildedRouter } from "./buildedRouter";
export interface Router {
    exec: BuildedRouter;
    readonly routes: ReadonlySet<Route>;
    readonly hooksRouteLifeCycle: readonly HookRouteLifeCycle[];
    readonly routeFunctionBuilders: readonly ReturnType<typeof createRouteFunctionBuilder>[];
    readonly stepFunctionBuilders: readonly ReturnType<typeof createStepFunctionBuilder>[];
    readonly hooksHubLifeCycle: readonly HookHubLifeCycle[];
}
