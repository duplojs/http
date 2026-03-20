import { type Request } from "../../request";
import { type BuildedRouter } from "../../router";
import { type RouterElementSystem } from "../../router/types/routerElementSystem";
import { type RouterElementWrapper } from "../../router/types/routerElementWrapper";
import { type Environment } from "../../types";
import { type MaybePromise } from "@duplojs/utils";
export interface RouterFunctionBuilderParams {
    readonly environment: Environment;
    readonly routerElementWrapper: RouterElementWrapper;
    readonly classRequest: typeof Request;
    readonly notfoundRouterElement: RouterElementSystem;
    readonly malformedUrlRouterElement: RouterElementSystem;
}
export type RouterFunctionBuilder = (params: RouterFunctionBuilderParams) => MaybePromise<BuildedRouter>;
export declare function createRouterFunctionBuilder(theFunction: RouterFunctionBuilder): RouterFunctionBuilder;
