import { type BuildStepFunctionParams } from "../steps";
import { type BuildRouteNotSupportEither, type createRouteFunctionBuilder } from "./create";
import { type HookRouteLifeCycle, type Route } from "../../route";
import { type ResponseContract } from "../../response";
export interface BuildRouteFunctionParams extends BuildStepFunctionParams {
    readonly routeFunctionBuilders: readonly ReturnType<typeof createRouteFunctionBuilder>[];
    readonly globalHooksRouteLifeCycle: readonly HookRouteLifeCycle[];
    readonly defaultExtractContract: ResponseContract.Contract;
}
export declare function buildRouteFunction(route: Route, params: BuildRouteFunctionParams): Promise<import("..").BuildStepNotSupportEither | import("./create").BuildRouteSuccessEither | BuildRouteNotSupportEither>;
