import { createCoreLibKind } from "@core/kind";
import { type Route, type HookRouteLifeCycle, routeKind } from "@core/route";
import { A, O, pipe, type Kind, type RemoveKind, type MaybeArray, type SimplifyTopLevel, P, isType } from "@duplojs/utils";
import { type HookHubLifeCycle } from "./hooks";
import { type createFunctionBuilder } from "@core/functionBuilder";
import { type Process } from "@core/process";
import { type Steps } from "@core/steps";
import { Request } from "@core/request";

export * from "./hooks";

export interface HubEnvironmentCustom {}

export type HubEnvironment = (
	// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
	| HubEnvironmentCustom[
		O.GetPropsWithValue<
			HubEnvironmentCustom,
			true
		>
	]
	| "DEV"
	| "PROD"
);

export interface HubDefinition {
	readonly hooksRouteLifeCycle?: readonly HookRouteLifeCycle[];
	readonly hooksHubLifeCycle?: readonly HookHubLifeCycle[];
	readonly routes?: readonly Route[];
	readonly routeFunctionBuilder?: readonly ReturnType<typeof createFunctionBuilder<Route>>[];
	readonly processFunctionBuilder?: readonly ReturnType<typeof createFunctionBuilder<Process>>[];
	readonly stepFunctionBuilder?: readonly ReturnType<typeof createFunctionBuilder<Steps>>[];
}

export interface HubFirstDefinition extends HubDefinition {
	readonly environment: HubEnvironment;
}

export interface PluginDefinition extends HubDefinition {
	name: string;
}

export const hubKind = createCoreLibKind("hub");

export interface Hub<
	GenericDefinition extends readonly [HubFirstDefinition, ...(HubDefinition | PluginDefinition)[]]
	= readonly [HubFirstDefinition, ...(HubDefinition | PluginDefinition)[]],
> extends Kind<typeof hubKind.definition> {
	readonly definitions: GenericDefinition;
	readonly classRequest: typeof Request;
	register(
		routes: Route | Iterable<Route> | Record<string, Route>
	): Hub<
		readonly [
			...GenericDefinition,
			{ readonly routes: Route[] },
		]
	>;
	addFunctionBuilder(
		builders: SimplifyTopLevel<
			Pick<
				HubDefinition,
				| "processFunctionBuilder"
				| "routeFunctionBuilder"
				| "stepFunctionBuilder"
			>
		>
	): Hub<
		readonly [
			...GenericDefinition,
			SimplifyTopLevel<
				Pick<
					HubDefinition,
					| "processFunctionBuilder"
					| "routeFunctionBuilder"
					| "stepFunctionBuilder"
				>
			>,
		]
	>;
	addHooks(
		builders: SimplifyTopLevel<
			Pick<
				HubDefinition,
				| "hooksHubLifeCycle"
				| "hooksRouteLifeCycle"
			>
		>
	): Hub<
		readonly [
			...GenericDefinition,
			SimplifyTopLevel<
				Pick<
					HubDefinition,
					| "hooksHubLifeCycle"
					| "hooksRouteLifeCycle"
				>
			>,
		]
	>;
	plug<
		const GenericPluginDefinition extends MaybeArray<PluginDefinition>,
	>(
		plugin: GenericPluginDefinition | ((self: this) => GenericPluginDefinition)
	): Hub<
		readonly [
			...GenericDefinition,
			...A.ArrayCoalescing<GenericPluginDefinition>,
		]
	>;
}

export function createHub<
	const GenericDefinition extends HubFirstDefinition,
>(
	firstDefinition: GenericDefinition,
): Hub<[GenericDefinition]>;

export function createHub<
	const GenericDefinition extends [HubFirstDefinition, ...HubDefinition[]],
>(
	definition: GenericDefinition,
): Hub<GenericDefinition>;

export function createHub(
	definition: HubFirstDefinition | [HubFirstDefinition, ...HubDefinition[]],
) {
	const definitions = A.coalescing(definition);

	const self: Hub = pipe(
		{
			definitions,
			classRequest: Request,
			plug(plugin) {
				return createHub([
					...definitions,
					...A.coalescing(
						typeof plugin === "function"
							? plugin(self)
							: plugin,
					),
				]);
			},
			register(routes) {
				return createHub([
					...definitions,
					{
						routes: pipe(
							routes,
							P.when(
								routeKind.has,
								A.coalescing,
							),
							P.when(
								isType("iterable"),
								A.from,
							),
							P.otherwise(O.values),
						),
					},
				]);
			},
			addFunctionBuilder(builders) {
				return createHub([
					...definitions,
					builders,
				]);
			},
			addHooks(hooks) {
				return createHub([
					...definitions,
					hooks,
				]);
			},
		} satisfies RemoveKind<Hub>,
		hubKind.setTo,
	);

	return self;
}
