import { E, type MaybePromise } from "@duplojs/utils";
import { type HookRouteLifeCycle, type Route } from "../../route";
import { type Request } from "../../request";
import { type Environment } from "../../types";
import { type BuildStepSuccessEither, type BuildStepNotSupportEither } from "../steps";
import { type Steps } from "../../steps";
import { type ResponseContract } from "../../response";
export type BuildedRouteFunction = (request: Request) => Promise<void>;
export type BuildRouteSuccessEither = E.EitherRight<"buildSuccess", BuildedRouteFunction>;
export type BuildRouteNotSupportEither = E.EitherLeft<"routeNotSupport", Route>;
export interface RouteFunctionBuilderParams {
    readonly globalHooksRouteLifeCycle: readonly HookRouteLifeCycle[];
    readonly environment: Environment;
    buildStep(element: Steps): Promise<BuildStepSuccessEither | BuildStepNotSupportEither>;
    success(result: BuildedRouteFunction): BuildRouteSuccessEither;
    readonly defaultExtractContract: ResponseContract.Contract;
}
export declare function createRouteFunctionBuilder(support: (route: Route) => boolean, builder: (route: Route, params: RouteFunctionBuilderParams) => MaybePromise<BuildRouteSuccessEither | BuildStepNotSupportEither>): (route: Route, params: RouteFunctionBuilderParams) => MaybePromise<BuildRouteNotSupportEither | BuildRouteSuccessEither | BuildStepNotSupportEither>;
