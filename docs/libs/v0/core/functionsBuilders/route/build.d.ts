import { type createStepFunctionBuilder } from "../steps";
import { type BuildRouteNotSupportEither, type createRouteFunctionBuilder } from "./create";
import { type HookRouteLifeCycle, type Route } from "../../route";
import { type ResponseContract } from "../../response";
import { type Environment } from "../../types";
export interface BuildRouteFunctionParams {
    readonly routeFunctionBuilders: readonly ReturnType<typeof createRouteFunctionBuilder>[];
    readonly globalHooksRouteLifeCycle: readonly HookRouteLifeCycle[];
    readonly stepFunctionBuilders: readonly ReturnType<typeof createStepFunctionBuilder>[];
    readonly environment: Environment;
    readonly defaultExtractContract: ResponseContract.Contract;
}
export declare function buildRouteFunction(route: Route, params: BuildRouteFunctionParams): Promise<import("..").BuildStepNotSupportEither | import("./create").BuildRouteSuccessEither | BuildRouteNotSupportEither>;
