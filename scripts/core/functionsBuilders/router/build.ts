import { type Environment } from "@core/types";
import { type createRouterFunctionBuilder } from "./create";
import { type Request } from "@core/request";
import { type RouterElementWrapper } from "@core/router/types/routerElementWrapper";
import { type RouterElementSystem } from "@core/router/types/routerElementSystem";

export interface BuildRouterFunctionParams {
	readonly routerFunctionBuilder: ReturnType<typeof createRouterFunctionBuilder>;
	readonly environment: Environment;
	readonly routerElementWrapper: RouterElementWrapper;
	readonly classRequest: typeof Request;
	readonly notfoundRouterElement: RouterElementSystem;
	readonly malformedUrlRouterElement: RouterElementSystem;
}

export async function buildRouterFunction(
	{
		routerFunctionBuilder,
		...params
	}: BuildRouterFunctionParams,
) {
	return routerFunctionBuilder(params);
}
