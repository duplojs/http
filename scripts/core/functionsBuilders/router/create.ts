import { type Request } from "@core/request";
import { type BuildedRouter } from "@core/router";
import { type RouterElementSystem } from "@core/router/types/routerElementSystem";
import { type RouterElementWrapper } from "@core/router/types/routerElementWrapper";
import { type Environment } from "@core/types";
import { type MaybePromise } from "bun";

export interface RouterFunctionBuilderParams {
	readonly environment: Environment;
	readonly routerElementWrapper: RouterElementWrapper;
	readonly classRequest: typeof Request;
	readonly notfoundRouterElement: RouterElementSystem;
	readonly malformedUrlRouterElement: RouterElementSystem;
}

export type RouterFunctionBuilder = (
	params: RouterFunctionBuilderParams
) => MaybePromise<BuildedRouter>;

export function createRouterFunctionBuilder(
	theFunction: RouterFunctionBuilder,
) {
	return theFunction;
}
