import { type O, pipe, type Kind } from "@duplojs/utils";
import { createCoreLibKind } from "../kind";
import { type RequestMethods } from "../request";
import { type ExtractStep, type CheckerStep, type CutStep, type HandlerStep, type ProcessStep, type stepKind, type PresetCheckerStep } from "../steps";
import { type HookRouteLifeCycle } from "./hooks";

export * from "./types";
export * from "./hooks";

export interface RouteStepsCustom {}

export type RouteSteps = (
	// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
	| RouteStepsCustom[
		O.GetPropsWithValueExtends<
			RouteStepsCustom,
			Kind<typeof stepKind.definition>
		>
	]
	| CheckerStep
	| PresetCheckerStep
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
