import { type MakeRequestFromHooks, type HookRouteLifeCycle, type RouteDefinition } from "@core/route";
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
	GenericPath extends string,
	const GenericPaths extends readonly [GenericPath, ...GenericPath[]],
	const GenericHooks extends readonly HookRouteLifeCycle[] = readonly [],
>(
	method: GenericMethod,
	path: GenericPaths,
	options?: {
		hooks?: GenericHooks | readonly HookRouteLifeCycle[];
	}
): RouteBuilder<
	{
		readonly method: GenericMethod;
		readonly paths: GenericPaths;
		readonly preFlightsStep: readonly [];
		readonly steps: readonly [];
		readonly hooks: GenericHooks;
	},
	{},
	NeverCoalescing<
		MakeRequestFromHooks<GenericHooks>,
		Request
	>
>;

export function useRouteBuilder<
	GenericMethod extends RequestMethods,
	GenericPath extends string,
	const GenericHooks extends readonly HookRouteLifeCycle[] = readonly [],
>(
	method: GenericMethod,
	path: GenericPath,
	options?: {
		hooks?: GenericHooks | readonly HookRouteLifeCycle[];
	}
): RouteBuilder<
	{
		readonly method: GenericMethod;
		readonly paths: readonly [GenericPath];
		readonly preFlightsStep: readonly [];
		readonly steps: readonly [];
		readonly hooks: GenericHooks;
	},
	{},
	NeverCoalescing<
		MakeRequestFromHooks<GenericHooks>,
		Request
	>
>;

export function useRouteBuilder(
	method: RequestMethods,
	path: string | [string, ...string[]],
	options?: { hooks?: HookRouteLifeCycle[] },
) {
	return routeBuilder.use({
		method,
		paths: A.coalescing(path),
		preFlightsStep: [],
		steps: [],
		hooks: options?.hooks ?? [],
	});
}
