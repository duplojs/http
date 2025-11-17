import { type MakeRequestFromHooks, type HookRouteLifeCycle, type RouteDefinition, type RoutePath } from "@core/route";
import { type Floor } from "@core/floor";
import { type RequestMethods, type Request } from "@core/request";
import { A, type Builder, createBuilder, type NeverCoalescing } from "@duplojs/utils";

export interface RouteBuilder<
	GenericDefinition extends RouteDefinition = RouteDefinition,
	GenericFloor extends Floor = {},
	GenericRequest extends Request = Request,
> extends Builder<RouteDefinition> {

}

export const routeBuilder = createBuilder<RouteBuilder>("@duplojs/http/core/route");

export function useRouteBuilder<
	GenericMethod extends RequestMethods,
	const GenericPaths extends RoutePath | readonly [RoutePath, ...RoutePath[]],
	const GenericHooks extends readonly HookRouteLifeCycle[] = readonly [],
>(
	method: GenericMethod,
	path: GenericPaths,
	options?: {
		hooks?: GenericHooks | readonly HookRouteLifeCycle[];
	},
): RouteBuilder<
		{
			readonly method: GenericMethod;
			readonly paths: GenericPaths extends string
				? readonly [GenericPaths]
				: GenericPaths;
			readonly preflightSteps: readonly [];
			readonly steps: readonly [];
			readonly hooks: GenericHooks;
		},
		{},
		NeverCoalescing<
			MakeRequestFromHooks<GenericHooks>,
			Request
		>
	> {
	return routeBuilder.use({
		method,
		paths: A.coalescing(path),
		preflightSteps: [],
		steps: [],
		hooks: options?.hooks ?? [],
	});
}
