import { createCoreLibKind } from "@core/kind";
import { type Route, type HookRouteLifeCycle, routeKind } from "@core/route";
import { A, O, pipe, type Kind, type MaybeArray, type MaybePromise, type DP, isType, P } from "@duplojs/utils";
import { type HookHubLifeCycle } from "./hooks";
import { type HandlerStepFunctionParams, type HandlerStep, createHandlerStep } from "@core/steps";
import { Request } from "@core/request";
import { type ClientErrorResponseCode, type ResponseContract } from "@core/response";
import { defaultNotfoundHandler } from "./defaultNotfoundHandler";
import { type Environment } from "@core/types";
import { defaultExtractContract } from "./defaultExtractContract";
import { type createStepFunctionBuilder } from "@core/functionsBuilders/steps";
import { type createRouteFunctionBuilder } from "@core/functionsBuilders/route";

export * from "./hooks";
export * from "./defaultNotfoundHandler";
export * from "./defaultExtractContract";

export const hubKind = createCoreLibKind("hub");

export interface HubConfig {
	readonly environment: Environment;
}

export interface HubPlugin {
	readonly name: string;
	readonly hooksRouteLifeCycle?: readonly HookRouteLifeCycle[];
	readonly hooksHubLifeCycle?: readonly HookHubLifeCycle[];
	readonly routes?: readonly Route[];
	readonly routeFunctionBuilders?: readonly ReturnType<typeof createRouteFunctionBuilder>[];
	readonly stepFunctionBuilders?: readonly ReturnType<typeof createStepFunctionBuilder>[];
}

export interface HubAggregates {
	readonly hooksRouteLifeCycle: readonly HookRouteLifeCycle[];
	readonly hooksHubLifeCycle: readonly HookHubLifeCycle[];
	readonly routes: readonly Route[];
	readonly routeFunctionBuilders: readonly ReturnType<typeof createRouteFunctionBuilder>[];
	readonly stepFunctionBuilders: readonly ReturnType<typeof createStepFunctionBuilder>[];
}

export interface Hub<
	GenericConfig extends HubConfig = HubConfig,
> extends Kind<typeof hubKind.definition> {
	readonly config: GenericConfig;

	readonly plugins: readonly HubPlugin[];

	readonly hooksRouteLifeCycle: readonly HookRouteLifeCycle[];

	readonly hooksHubLifeCycle: readonly HookHubLifeCycle[];

	readonly routes: readonly Route[];

	readonly routeFunctionBuilders: readonly ReturnType<typeof createRouteFunctionBuilder>[];

	readonly stepFunctionBuilders: readonly ReturnType<typeof createStepFunctionBuilder>[];

	readonly classRequest: typeof Request;

	readonly notfoundHandler: HandlerStep;

	readonly defaultExtractContract: ResponseContract.Contract<
		ClientErrorResponseCode,
		string,
		DP.DataParserEmpty
	>;

	register(
		routes: Route | Iterable<Route> | Record<string, Route>
	): Hub<GenericConfig>;

	addRouteFunctionBuilder(
		functionBuilder: MaybeArray<ReturnType<typeof createRouteFunctionBuilder>>
	): Hub<GenericConfig>;

	addStepFunctionBuilder(
		functionBuilder: MaybeArray<ReturnType<typeof createStepFunctionBuilder>>
	): Hub<GenericConfig>;

	addRouteHooks(
		hook: MaybeArray<HookRouteLifeCycle>
	): Hub<GenericConfig>;

	addHubHooks(
		hook: MaybeArray<HookHubLifeCycle>
	): Hub<GenericConfig>;

	plug(
		plugin: HubPlugin | ((self: this) => HubPlugin)
	): Hub<GenericConfig>;

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
	): Hub<GenericConfig>;

	setDefaultExtractContract(
		responseContract: this["defaultExtractContract"]
	): Hub<GenericConfig>;

	aggregates(): HubAggregates;

	aggregatesRoutes(): readonly Route[];

	aggregatesRouteFunctionBuilders(): readonly ReturnType<typeof createRouteFunctionBuilder>[];

	aggregatesStepFunctionBuilders(): readonly ReturnType<typeof createStepFunctionBuilder>[];

	aggregatesHooksHubLifeCycle<
		GenericHookName extends keyof HookHubLifeCycle,
	>(hookName: GenericHookName): readonly Exclude<HookHubLifeCycle[GenericHookName], undefined>[];

	aggregatesHooksRouteLifeCycle<
		GenericHookName extends keyof HookRouteLifeCycle,
	>(hookName: GenericHookName): readonly Exclude<HookRouteLifeCycle[GenericHookName], undefined>[];
}

export function createHub<
	const GenericConfig extends HubConfig,
>(
	config: GenericConfig,
): Hub<GenericConfig> {
	return {
		...hubKind.addTo({}),
		config,
		plugins: [],
		hooksHubLifeCycle: [],
		hooksRouteLifeCycle: [],
		routeFunctionBuilders: [],
		routes: [],
		stepFunctionBuilders: [],
		notfoundHandler: defaultNotfoundHandler,
		defaultExtractContract,
		classRequest: Request,
		addHubHooks(hook) {
			return {
				...this,
				hooksHubLifeCycle: A.concat(this.hooksHubLifeCycle, A.coalescing(hook)),
			};
		},
		addRouteFunctionBuilder(functionBuilder) {
			return {
				...this,
				routeFunctionBuilders: A.concat(this.routeFunctionBuilders, A.coalescing(functionBuilder)),
			};
		},
		addRouteHooks(hook) {
			return {
				...this,
				hooksRouteLifeCycle: A.concat(this.hooksRouteLifeCycle, A.coalescing(hook)),
			};
		},
		addStepFunctionBuilder(hook) {
			return {
				...this,
				stepFunctionBuilders: A.concat(this.stepFunctionBuilders, A.coalescing(hook)),
			};
		},
		plug(plugin) {
			return {
				...this,
				plugins: A.push(
					this.plugins,
					typeof plugin === "function"
						? plugin(this)
						: plugin,
				),
			};
		},
		register(route) {
			return {
				...this,
				routes: A.concat(
					this.routes,
					pipe(
						route,
						P.when(
							routeKind.has,
							A.coalescing,
						),
						P.when(
							isType("iterable"),
							A.from,
						),
						P.otherwise(O.values),
						A.filter((route) => !A.includes(this.routes, route)),
					),
				),
			};
		},
		setDefaultExtractContract(defaultExtractContract) {
			return {
				...this,
				defaultExtractContract,
			};
		},
		setNotfoundHandler(responseContract, theFunction) {
			return {
				...this,
				notfoundHandler: createHandlerStep({
					responseContract,
					theFunction: (floor, params) => theFunction(params),
				}),
			};
		},
		aggregates() {
			return A.reduce(
				this.plugins,
				A.reduceFrom<HubAggregates>({
					hooksRouteLifeCycle: this.hooksRouteLifeCycle,
					routeFunctionBuilders: this.routeFunctionBuilders,
					stepFunctionBuilders: this.stepFunctionBuilders,
					routes: this.routes,
					hooksHubLifeCycle: this.hooksHubLifeCycle,
				}),
				({
					lastValue,
					element: plugin,
					next,
				}) => next({
					hooksRouteLifeCycle: plugin.hooksRouteLifeCycle
						? A.concat(lastValue.hooksRouteLifeCycle, plugin.hooksRouteLifeCycle)
						: lastValue.hooksRouteLifeCycle,
					routeFunctionBuilders: plugin.routeFunctionBuilders
						? A.concat(lastValue.routeFunctionBuilders, plugin.routeFunctionBuilders)
						: lastValue.routeFunctionBuilders,
					stepFunctionBuilders: plugin.stepFunctionBuilders
						? A.concat(lastValue.stepFunctionBuilders, plugin.stepFunctionBuilders)
						: lastValue.stepFunctionBuilders,
					routes: plugin.routes
						? A.concat(lastValue.routes, plugin.routes)
						: lastValue.routes,
					hooksHubLifeCycle: plugin.hooksHubLifeCycle
						? A.concat(lastValue.hooksHubLifeCycle, plugin.hooksHubLifeCycle)
						: lastValue.hooksHubLifeCycle,
				}),
			);
		},
		aggregatesRoutes() {
			return A.reduce(
				this.plugins,
				A.reduceFrom(this.routes),
				({
					lastValue,
					element: { routes },
					next,
				}) => routes
					? next(A.concat(lastValue, routes))
					: next(lastValue),
			);
		},
		aggregatesRouteFunctionBuilders() {
			return A.reduce(
				this.plugins,
				A.reduceFrom(this.routeFunctionBuilders),
				({
					lastValue,
					element: { routeFunctionBuilders },
					next,
				}) => routeFunctionBuilders
					? next(A.concat(lastValue, routeFunctionBuilders))
					: next(lastValue),
			);
		},
		aggregatesStepFunctionBuilders() {
			return A.reduce(
				this.plugins,
				A.reduceFrom(this.stepFunctionBuilders),
				({
					lastValue,
					element: { stepFunctionBuilders },
					next,
				}) => stepFunctionBuilders
					? next(A.concat(lastValue, stepFunctionBuilders))
					: next(lastValue),
			);
		},
		aggregatesHooksHubLifeCycle(hookName) {
			const hooks = A.flatMap(
				this.hooksHubLifeCycle,
				(hooks) => hooks[hookName] ?? [],
			);

			return A.reduce(
				this.plugins,
				A.reduceFrom<HookHubLifeCycle[keyof HookHubLifeCycle][]>(hooks),
				({
					lastValue,
					element: { hooksHubLifeCycle },
					next,
				}) => {
					if (!hooksHubLifeCycle) {
						return next(lastValue);
					}

					return next(
						A.concat(
							lastValue,
							A.flatMap(
								hooksHubLifeCycle,
								(hooks) => hooks[hookName] ?? [],
							),
						),
					);
				},
			) as never;
		},
		aggregatesHooksRouteLifeCycle(hookName) {
			const hooks = A.flatMap(
				this.hooksRouteLifeCycle,
				(hooks) => hooks[hookName] ?? [],
			);

			return A.reduce(
				this.plugins,
				A.reduceFrom<HookRouteLifeCycle[keyof HookRouteLifeCycle][]>(hooks),
				({
					lastValue,
					element: { hooksRouteLifeCycle },
					next,
				}) => {
					if (!hooksRouteLifeCycle) {
						return next(lastValue);
					}

					return next(
						A.concat(
							lastValue,
							A.flatMap(
								hooksRouteLifeCycle,
								(hooks) => hooks[hookName] ?? [],
							),
						),
					);
				},
			) as never;
		},
	};
}
