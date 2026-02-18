import { type O, type Kind } from "@duplojs/utils";
import { type BodyController, type RequestMethods } from "../request";
import { type ExtractStep, type CheckerStep, type CutStep, type HandlerStep, type ProcessStep, type stepKind, type PresetCheckerStep } from "../steps";
import { type HookRouteLifeCycle } from "./hooks";
import { type Metadata } from "../metadata";
export * from "./types";
export * from "./hooks";
export interface RouteStepsCustom {
}
export type RouteSteps = (RouteStepsCustom[O.GetPropsWithValueExtends<RouteStepsCustom, Kind<typeof stepKind.definition>>] | CheckerStep | PresetCheckerStep | ProcessStep | ExtractStep | CutStep | HandlerStep);
export interface RoutePreFlightStepsCustom {
}
export type RoutePreFlightSteps = (RoutePreFlightStepsCustom[O.GetPropsWithValueExtends<RoutePreFlightStepsCustom, Kind<typeof stepKind.definition>>] | ProcessStep);
export type RoutePath = `/${string}`;
export interface RouteDefinition {
    readonly paths: readonly [RoutePath, ...RoutePath[]];
    readonly method: RequestMethods;
    readonly preflightSteps: readonly RoutePreFlightSteps[];
    readonly steps: readonly RouteSteps[];
    readonly hooks: readonly HookRouteLifeCycle[];
    readonly metadata: readonly Metadata[];
    readonly bodyController: BodyController | null;
}
export declare const routeKind: import("@duplojs/utils").KindHandler<import("@duplojs/utils").KindDefinition<"@DuplojsHttpCore/route", unknown>>;
export interface Route<GenericDefinition extends RouteDefinition = RouteDefinition> extends Kind<typeof routeKind.definition> {
    readonly definition: GenericDefinition;
}
export declare function createRoute<GenericDefinition extends RouteDefinition>(definition: GenericDefinition): Route<GenericDefinition>;
