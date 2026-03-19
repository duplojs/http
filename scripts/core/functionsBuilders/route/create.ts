import { E, type MaybePromise } from "@duplojs/utils";
import { type BuildedRoute, type HookRouteLifeCycle, type Route } from "@core/route";
import { type Environment } from "@core/types";
import { type BuildStepSuccessEither, type BuildStepNotSupportEither } from "../steps";
import { type Steps } from "@core/steps";
import { type ResponseContract } from "@core/response";

export type BuildRouteSuccessEither<
> = E.Right<"buildSuccess", BuildedRoute>;

export type BuildRouteNotSupportEither = E.Left<"routeNotSupport", Route>;

export interface RouteFunctionBuilderParams {
	readonly globalHooksRouteLifeCycle: readonly HookRouteLifeCycle[];

	readonly environment: Environment;

	buildStep(
		element: Steps
	): Promise<
			| BuildStepSuccessEither
			| BuildStepNotSupportEither
	>;

	success(
		result: BuildedRoute
	): BuildRouteSuccessEither;

	readonly defaultExtractContract: ResponseContract.Contract;
}

export function createRouteFunctionBuilder(
	support: (route: Route) => boolean,
	builder: (
		route: Route,
		params: RouteFunctionBuilderParams,
	) => MaybePromise<
		| BuildRouteSuccessEither
		| BuildStepNotSupportEither
	>,
) {
	return (
		route: Route,
		params: RouteFunctionBuilderParams,
	): MaybePromise<
		| BuildRouteNotSupportEither
		| BuildRouteSuccessEither
		| BuildStepNotSupportEither
	> => support(route)
		? builder(
			route,
			params,
		)
		: Promise.resolve(E.left("routeNotSupport", route));
}
