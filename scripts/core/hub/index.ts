import { createCoreLibKind } from "@core/kind";
import { type Route, type HookRouteLifeCycle, routeKind } from "@core/route";
import { A, O, pipe, type Kind, type RemoveKind, type MaybeArray, type SimplifyTopLevel, P, isType, type MaybePromise } from "@duplojs/utils";
import { type HookHubLifeCycle } from "./hooks";
import { type BuildElementParams, type createFunctionBuilder } from "@core/functionBuilder";
import { type Process } from "@core/process";
import { type HandlerStepFunctionParams, type HandlerStep, createHandlerStep } from "@core/steps";
import { Request } from "@core/request";
import { type ResponseContract } from "@core/response";
import { defaultNotfoundHandler } from "./defaultNotfoundHandler";
import { type Environment } from "@core/types";

export * from "./hooks";
export * from "./defaultNotfoundHandler";

export interface HubDefinition {
	readonly hooksRouteLifeCycle?: readonly HookRouteLifeCycle[];
	readonly hooksHubLifeCycle?: readonly HookHubLifeCycle[];
	readonly routes?: readonly Route[];
	readonly routeFunctionBuilders?: readonly ReturnType<typeof createFunctionBuilder<Route>>[];
	readonly processFunctionBuilders?: readonly ReturnType<typeof createFunctionBuilder<Process>>[];
	readonly stepFunctionBuilders?: BuildElementParams["stepFunctionBuilders"];
}

export interface HubFirstDefinition extends HubDefinition {
	readonly environment: Environment;
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
			HubDefinition,
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
			HubDefinition,
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
			HubDefinition,
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

export interface HubProperties {
	readonly notfoundHandler: HandlerStep;
}

export function createHub<
	const GenericDefinition extends HubFirstDefinition,
>(
	firstDefinition: GenericDefinition,
): Hub<[GenericDefinition]>;

export function createHub<
	const GenericDefinition extends [HubFirstDefinition, ...HubDefinition[]],
>(
	definitions: GenericDefinition,
	properties: HubProperties,
): Hub<GenericDefinition>;

export function createHub(
	definition: HubFirstDefinition | [HubFirstDefinition, ...HubDefinition[]],
	properties: HubProperties = { notfoundHandler: defaultNotfoundHandler },
) {
	const definitions = A.coalescing(definition);

	const self: Hub = pipe(
		{
			definitions,
			classRequest: Request,
			plug(plugin) {
				return createHub(
					[
						...definitions,
						...A.coalescing(
							typeof plugin === "function"
								? plugin(self)
								: plugin,
						),
					],
					properties,
				);
			},
			register(routes) {
				return createHub(
					[
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
					],
					properties,
				);
			},
			addFunctionBuilder(builders) {
				return createHub(
					[
						...definitions,
						builders,
					],
					properties,
				);
			},
			addHooks(hooks) {
				return createHub(
					[
						...definitions,
						hooks,
					],
					properties,
				);
			},
			setNotfoundHandler(responseContract, theFunction) {
				return createHub(
					definitions,
					{
						...properties,
						notfoundHandler: createHandlerStep({
							responseContract,
							theFunction: (floor, params) => theFunction(params),
						}),
					},
				);
			},
			notfoundHandler: properties.notfoundHandler,
		} satisfies RemoveKind<Hub>,
		hubKind.setTo,
	);

	return self;
}
