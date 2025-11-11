import { createCoreLibKind } from "@core/kind";
import { type Route, type HookRouteLifeCycle, routeKind } from "@core/route";
import { A, pipe, type Kind, type RemoveKind, type MaybeArray, type SimplifyTopLevel, type O } from "@duplojs/utils";
import { type HookHubLifeCycle } from "./hooks";
import { type createFunctionBuilder } from "@core/functionBuilder";
import { type Process } from "@core/process";
import { type Steps } from "@core/steps";

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
	GenericDefinition extends readonly HubDefinition[] = readonly HubDefinition[],
> extends Kind<typeof hubKind.definition> {
	readonly definitions: GenericDefinition;
	register(
		routes: Route | Iterable<Route> | Record<string, Route>
	): Hub<
		readonly [
			...GenericDefinition,
			{ routes: Route[] },
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
						routes: routeKind.has(routes)
							? [routes]
							: Object.values(routes),
					},
				]);
			},
			addFunctionBuilder(builders) {
				return createHub([
					...definitions,
					builders,
				]);
			},
		} satisfies RemoveKind<Hub>,
		hubKind.setTo,
	);

	return self;
}
