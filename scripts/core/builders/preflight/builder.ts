import { type Floor } from "@core/floor";
import { type MakeRequestFromHooks, type HookRouteLifeCycle, type RoutePreFlightSteps } from "@core/route";
import { type Builder, createBuilder, type NeverCoalescing } from "@duplojs/utils";
import { type Request } from "@core/request";

export interface PreflightBuilderDefinition {
	readonly preflightSteps: readonly RoutePreFlightSteps[];
	readonly hooks: readonly HookRouteLifeCycle[];
}

export interface PreflightBuilder<
	GenericDefinition extends PreflightBuilderDefinition = PreflightBuilderDefinition,
	GenericFloor extends Floor = {},
	GenericRequest extends Request = Request,
> extends Builder<PreflightBuilderDefinition> {

}

export const preflightBuilder = createBuilder<PreflightBuilder>("@duplojs/http/core/preflight");

export function usePreflightBuilder<
	const GenericHooks extends readonly HookRouteLifeCycle[] = readonly [],
>(
	options?: {
		hooks?: GenericHooks | readonly HookRouteLifeCycle[];
	},
): PreflightBuilder<
		{
			readonly preflightSteps: readonly [];
			readonly hooks: GenericHooks;
		},
		{},
		NeverCoalescing<
			MakeRequestFromHooks<GenericHooks>,
			Request
		>
	> {
	return preflightBuilder.use({
		preflightSteps: [],
		hooks: options?.hooks ?? [],
	});
}
