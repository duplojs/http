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

export interface RoutePreFlightStepsCustom {}

export type RoutePreFlightSteps = (
	// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
	| RoutePreFlightStepsCustom[
		O.GetPropsWithValueExtends<
			RoutePreFlightStepsCustom,
			Kind<typeof stepKind.definition>
		>
	]
	| ProcessStep
);

export type RoutePath = `/${string}`;

export interface RouteDefinition {
	readonly paths: readonly [RoutePath, ...RoutePath[]];
	readonly method: RequestMethods;
	readonly preFlightSteps: readonly RoutePreFlightSteps[];
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
