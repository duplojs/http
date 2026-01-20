import { type Floor } from "@core/floor";
import { type MakeRequestFromHooks, type HookRouteLifeCycle, type RoutePreFlightSteps } from "@core/route";
import { type Builder, createBuilder, type NeverCoalescing } from "@duplojs/utils";
import { type Request } from "@core/request";
import { createCoreLibStringIdentifier } from "@core/stringIdentifier";
import { type Metadata } from "@core/metadata";

export interface PreflightBuilderDefinition {
	readonly preflightSteps: readonly RoutePreFlightSteps[];
	readonly hooks: readonly HookRouteLifeCycle[];
	readonly metadata: readonly Metadata[];
}

export interface PreflightBuilder<
	GenericDefinition extends PreflightBuilderDefinition = PreflightBuilderDefinition,
	GenericFloor extends Floor = {},
	GenericRequest extends Request = Request,
> extends Builder<PreflightBuilderDefinition> {

}

export const preflightBuilder = createBuilder<PreflightBuilder>(
	createCoreLibStringIdentifier("preflight"),
);

export function usePreflightBuilder<
	const GenericHooks extends readonly HookRouteLifeCycle[] = readonly [],
	const GenericMetadata extends readonly Metadata[] = readonly [],
>(
	options?: {
		hooks?: GenericHooks | readonly HookRouteLifeCycle[];
		metadata?: GenericMetadata;
	},
): PreflightBuilder<
		{
			readonly preflightSteps: readonly [];
			readonly hooks: GenericHooks;
			readonly metadata: GenericMetadata;
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
		metadata: options?.metadata ?? [],
	});
}
