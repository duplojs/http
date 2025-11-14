import { createCoreLibKind } from "@core/kind";
import { type Route, type HookRouteLifeCycle, routeKind } from "@core/route";
import { A, O, pipe, type Kind, type RemoveKind, type MaybeArray, type SimplifyTopLevel, P, isType, type MaybePromise } from "@duplojs/utils";
import { type HookHubLifeCycle } from "./hooks";
import { type createFunctionBuilder } from "@core/functionBuilder";
import { type Process } from "@core/process";
import { type HandlerStepFunctionParams, type HandlerStep, type Steps, createHandlerStep } from "@core/steps";
import { Request } from "@core/request";
import { type ResponseContract } from "@core/response";
import { defaultNotfoundHandler } from "./defaultNotfoundHandler";

export * from "./hooks";
export * from "./defaultNotfoundHandler";

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
	readonly routeFunctionBuilders?: readonly ReturnType<typeof createFunctionBuilder<Route>>[];
	readonly processFunctionBuilders?: readonly ReturnType<typeof createFunctionBuilder<Process>>[];
	readonly stepFunctionBuilders?: readonly ReturnType<typeof createFunctionBuilder<Steps>>[];
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
	readonly notfoundHandler: HandlerStep;
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
				| "processFunctionBuilders"
				| "routeFunctionBuilders"
				| "stepFunctionBuilders"
			>
		>
	): Hub<
		readonly [
			...GenericDefinition,
			SimplifyTopLevel<
				Pick<
					HubDefinition,
					| "processFunctionBuilders"
					| "routeFunctionBuilders"
					| "stepFunctionBuilders"
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
	setNotfoundHandler<
		GenericResponseContract extends ResponseContract.Contract,
		GenericResponse extends ResponseContract.Convert<
			GenericResponseContract
		>,
	>(
		responseContract: GenericResponseContract,
		theFunction: (
			param: HandlerStepFunctionParams<
				Request,
				GenericResponse
			>
		) => MaybePromise<GenericResponse>
	): this;
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
				return {
					...createHub([
						...definitions,
						...A.coalescing(
							typeof plugin === "function"
								? plugin(self)
								: plugin,
						),
					]),
					notfoundHandler: self.notfoundHandler,
				};
			},
			register(routes) {
				return {
					...createHub([
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
					]),
					notfoundHandler: self.notfoundHandler,
				};
			},
			addFunctionBuilder(builders) {
				return {
					...createHub([
						...definitions,
						builders,
					]),
					notfoundHandler: self.notfoundHandler,
				};
			},
			addHooks(hooks) {
				return {
					...createHub([
						...definitions,
						hooks,
					]),
					notfoundHandler: self.notfoundHandler,
				};
			},
			setNotfoundHandler(responseContract, theFunction: never) {
				return {
					...self,
					notfoundHandler: createHandlerStep({
						responseContract,
						theFunction,
					}),
				};
			},
			notfoundHandler: defaultNotfoundHandler,
		} satisfies RemoveKind<Hub>,
		hubKind.setTo,
	);

	return self;
}
