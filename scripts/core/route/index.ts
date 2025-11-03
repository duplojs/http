import { pipe, type Kind } from "@duplojs/utils";
import { createCoreLibKind } from "../kind";
import { type RequestMethods } from "../request";
import { type ExtractStep, type CheckerStep, type CutStep, type HandlerStep, type ProcessStep } from "../steps";
import { type HookRouteLifeCycle } from "./hooks";

export * from "./hooks";

export type RouteSteps = (
	| CheckerStep
	| ProcessStep
	| ExtractStep
	| CutStep
	| HandlerStep
);

export interface RouteDefinition {
	readonly paths: readonly [string, ...string[]];
	readonly method: RequestMethods;
	readonly preFlightsStep: readonly [];
	readonly steps: readonly RouteSteps[];
	readonly hooks: readonly HookRouteLifeCycle[];
}

export const routeKind = createCoreLibKind("route");

export interface Route<
	GenericDefinition extends RouteDefinition = RouteDefinition,
> extends Kind<typeof routeKind.definition> {
	readonly definition: GenericDefinition;
}

export function createRoute<
	GenericDefinition extends RouteDefinition,
>(
	definition: GenericDefinition,
): Route<GenericDefinition> {
	return pipe(
		{ definition },
		routeKind.setTo,
	);
}
