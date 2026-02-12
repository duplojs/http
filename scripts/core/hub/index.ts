import { createCoreLibKind } from "@core/kind";
import { type Route, type HookRouteLifeCycle, routeKind } from "@core/route";
import { A, O, pipe, type MaybeArray, type MaybePromise, type DP, isType, P, kindHeritage } from "@duplojs/utils";
import { type HookHubLifeCycle } from "./hooks";
import { type HandlerStepFunctionParams, type HandlerStep, createHandlerStep } from "@core/steps";
import { type BodyController, type BodyReaderImplementation, Request } from "@core/request";
import { type ClientErrorResponseCode, type ResponseContract } from "@core/response";
import { defaultNotfoundHandler } from "./defaultNotfoundHandler";
import { type Environment } from "@core/types";
import { defaultExtractContract } from "./defaultExtractContract";
import { type createStepFunctionBuilder } from "@core/functionsBuilders/steps";
import { type createRouteFunctionBuilder } from "@core/functionsBuilders/route";
import { defaultBodyController } from "./defaultBodyController";

export * from "./hooks";
export * from "./defaultNotfoundHandler";
export * from "./defaultExtractContract";
export * from "./defaultBodyController";

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
	readonly bodyReaderImplementation?: readonly BodyReaderImplementation[];
}

export class Hub<
	GenericConfig extends HubConfig = HubConfig,
> extends kindHeritage(
		"hub",
		createCoreLibKind("hub"),
	) {
	public plugins: HubPlugin[] = [];

	public hooksRouteLifeCycle: HookRouteLifeCycle[] = [];

	public hooksHubLifeCycle: HookHubLifeCycle[] = [];

	public routes = new Set<Route>();

	public routeFunctionBuilders: ReturnType<typeof createRouteFunctionBuilder>[] = [];

	public stepFunctionBuilders: ReturnType<typeof createStepFunctionBuilder>[] = [];

	public bodyReaderImplementations: BodyReaderImplementation[] = [];

	public classRequest = Request;

	public notfoundHandler: HandlerStep = defaultNotfoundHandler;

	public defaultExtractContract: ResponseContract.Contract<
		ClientErrorResponseCode,
		string,
		DP.DataParserEmpty
	> = defaultExtractContract;

	public defaultBodyController: BodyController = defaultBodyController;

	private constructor(
		public config: GenericConfig,
	) {
		super({});
	}

	public register(
		routes: Route | Iterable<Route> | Record<string, Route>,
	) {
		pipe(
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
			A.map((route) => this.routes.add(route)),
		);

		return this;
	}

	public addRouteFunctionBuilder(
		functionBuilder: MaybeArray<ReturnType<typeof createRouteFunctionBuilder>>,
	) {
		this.routeFunctionBuilders.push(...A.coalescing(functionBuilder));
		return this;
	}

	public addStepFunctionBuilder(
		functionBuilder: MaybeArray<ReturnType<typeof createStepFunctionBuilder>>,
	) {
		this.stepFunctionBuilders.push(...A.coalescing(functionBuilder));
		return this;
	}

	public addRouteHooks(
		hook: MaybeArray<HookRouteLifeCycle>,
	) {
		this.hooksRouteLifeCycle.push(...A.coalescing(hook));
		return this;
	}

	public addHubHooks(
		hook: MaybeArray<HookHubLifeCycle>,
	) {
		this.hooksHubLifeCycle.push(...A.coalescing(hook));
		return this;
	}

	public addBodyReaderImplementation(
		bodyReaderImplementation: MaybeArray<BodyReaderImplementation>,
	) {
		this.bodyReaderImplementations.push(...A.coalescing(bodyReaderImplementation));
		return this;
	}

	public plug(
		plugin: HubPlugin | ((self: this) => HubPlugin),
	) {
		const pluginResult = typeof plugin === "function"
			? plugin(this)
			: plugin;

		if (pluginResult.bodyReaderImplementation) {
			this.addBodyReaderImplementation(pluginResult.bodyReaderImplementation);
		}

		if (pluginResult.hooksHubLifeCycle) {
			this.addHubHooks(pluginResult.hooksHubLifeCycle);
		}

		if (pluginResult.hooksRouteLifeCycle) {
			this.addRouteHooks(pluginResult.hooksRouteLifeCycle);
		}

		if (pluginResult.routeFunctionBuilders) {
			this.addRouteFunctionBuilder(pluginResult.routeFunctionBuilders);
		}

		if (pluginResult.routes) {
			this.register(pluginResult.routes);
		}

		if (pluginResult.stepFunctionBuilders) {
			this.addStepFunctionBuilder(pluginResult.stepFunctionBuilders);
		}

		this.plugins.push(pluginResult);

		return this;
	}

	public setNotfoundHandler<
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
		) => MaybePromise<GenericResponse>,
	) {
		this.notfoundHandler = createHandlerStep({
			responseContract,
			theFunction: (floor, params) => theFunction(params),
			metadata: [],
		});

		return this;
	}

	public setDefaultExtractContract(
		responseContract: this["defaultExtractContract"],
	) {
		this.defaultExtractContract = responseContract;

		return this;
	}

	public aggregatesHooksHubLifeCycle<
		GenericHookName extends keyof HookHubLifeCycle,
	>(hookName: GenericHookName) {
		return A.flatMap(
			this.hooksHubLifeCycle,
			(hooks) => hooks[hookName] ?? [],
		);
	}

	public setDefaultBodyController(bodyController: BodyController) {
		this.defaultBodyController = bodyController;

		return this;
	}

	public aggregatesHooksRouteLifeCycle<
		GenericHookName extends keyof HookRouteLifeCycle,
	>(hookName: GenericHookName) {
		return A.flatMap(
			this.hooksRouteLifeCycle,
			(hooks) => hooks[hookName] ?? [],
		);
	}

	/**
	 * @internal
	 */
	public static "new"<
		GenericConfig extends HubConfig,
	>(config: GenericConfig) {
		return new Hub(config);
	}
}

export function createHub<
	const GenericConfig extends HubConfig,
>(
	config: GenericConfig,
) {
	return Hub.new(config);
}
