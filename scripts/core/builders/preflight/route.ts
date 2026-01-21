import { type Floor } from "@core/floor";
import { type RequestMethods, type Request } from "@core/request";
import { preflightBuilder } from "./builder";
import { type MakeRequestFromHooks, type HookRouteLifeCycle, type RoutePath } from "@core/route";
import { routeBuilderHandler, type RouteBuilder } from "../route";
import { A, type NeverCoalescing } from "@duplojs/utils";
import { type Metadata } from "@core/metadata";

declare module "./builder" {
	interface PreflightBuilder<
		GenericDefinition extends PreflightBuilderDefinition = PreflightBuilderDefinition,
		GenericFloor extends Floor = {},
		GenericRequest extends Request = Request,
	> {
		useRouteBuilder<
			GenericMethod extends RequestMethods,
			const GenericPaths extends RoutePath | readonly [RoutePath, ...RoutePath[]],
			const GenericHooks extends readonly HookRouteLifeCycle[] = readonly [],
			const GenericMetadata extends readonly Metadata[] = readonly [],
		>(
			method: GenericMethod,
			path: GenericPaths,
			options?: {
				hooks?: GenericHooks | readonly HookRouteLifeCycle[];
				metadata?: GenericMetadata;
			},
		): RouteBuilder<
			{
				readonly method: GenericMethod;
				readonly paths: GenericPaths extends string
					? readonly [GenericPaths]
					: GenericPaths;
				readonly preflightSteps: GenericDefinition["preflightSteps"];
				readonly steps: readonly [];
				readonly hooks: readonly [
					...GenericDefinition["hooks"],
					...GenericHooks,
				];
				readonly metadata: readonly [
					...GenericDefinition["metadata"],
					...GenericMetadata,
				];
			},
			GenericFloor,
			(
				& GenericRequest
				& NeverCoalescing<
					MakeRequestFromHooks<GenericHooks>,
					Request
				>
			)
		>;
	}
}

preflightBuilder.set(
	"useRouteBuilder",
	({
		args: [
			method,
			paths,
			options,
		],
		accumulator,
	}) => routeBuilderHandler.use({
		method,
		paths: A.coalescing(paths),
		preflightSteps: accumulator.preflightSteps,
		steps: [],
		hooks: [
			...(options?.hooks ?? []),
			...accumulator.hooks,
		],
		metadata: [
			...(options?.metadata ?? []),
			...accumulator.metadata,
		],
	}),
);
