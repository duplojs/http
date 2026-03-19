import { type Environment } from "../../types";
import { type createRouterFunctionBuilder } from "./create";
import { type Request } from "../../request";
import { type RouterElementWrapper } from "../../router/types/routerElementWrapper";
import { type RouterElementSystem } from "../../router/types/routerElementSystem";
export interface BuildRouterFunctionParams {
    readonly routerFunctionBuilder: ReturnType<typeof createRouterFunctionBuilder>;
    readonly environment: Environment;
    readonly routerElementWrapper: RouterElementWrapper;
    readonly classRequest: typeof Request;
    readonly notfoundRouterElement: RouterElementSystem;
    readonly malformedUrlRouterElement: RouterElementSystem;
}
export declare function buildRouterFunction({ routerFunctionBuilder, ...params }: BuildRouterFunctionParams): Promise<import("../..").BuildedRouter>;
