import { type HubDefinition, type Hub, launchHookBeforeBuildRoute } from "@core/hub";
import { type BuildedRouter } from "./types";
import { A, asyncPipe, E, forward, G, isType, justReturn, O, pipe, unwrap } from "@duplojs/utils";
import { type BuildedRoute } from "@core/route/types";
import { pathToRegExp } from "./pathToRegExp";
import { createRoute } from "@core/route";
import { RouterBuildError } from "./buildError";
import { buildRouteFunction, type BuildRouteFunctionParams, defaultRouteFunctionBuilder } from "@core/functionsBuilders/route";
import { defaultCheckerStepFunctionBuilder, defaultCutStepFunctionBuilder, defaultExtractStepFunctionBuilder, defaultHandlerStepFunctionBuilder, defaultProcessStepFunctionBuilder } from "@core/functionsBuilders/steps";

export * from "./types";
export * from "./pathToRegExp";
export * from "./buildError";

type ReducedDefinition = Required<
	Pick<
		HubDefinition,
		| "routes"
		| "hooksRouteLifeCycle"
		| "routeFunctionBuilders"
		| "stepFunctionBuilders"
		| "hooksHubLifeCycle"
	>
>;

interface RouterElement {
	pattern: RegExp;
	matchedPath: string;
	buildedRoute: BuildedRoute;
}

type GroupedRoute = Record<
	string,
	RouterElement[]
>;

export async function buildRouter(inputHub: Hub): Promise<BuildedRouter> {
	const hub = inputHub.addFunctionBuilder({
		routeFunctionBuilders: [defaultRouteFunctionBuilder],
		stepFunctionBuilders: [
			defaultCheckerStepFunctionBuilder,
			defaultCutStepFunctionBuilder,
			defaultHandlerStepFunctionBuilder,
			defaultExtractStepFunctionBuilder,
			defaultProcessStepFunctionBuilder,
		],
	});
	const { environment } = hub.definitions[0];
	const {
		hooksRouteLifeCycle,
		routeFunctionBuilders,
		routes,
		stepFunctionBuilders,
		hooksHubLifeCycle,
	} = A.reduce(
		hub.definitions,
		A.reduceFrom<ReducedDefinition>({
			hooksRouteLifeCycle: [],
			routeFunctionBuilders: [],
			stepFunctionBuilders: [],
			routes: [],
			hooksHubLifeCycle: [],
		}),
		({
			lastValue,
			element: definition,
			next,
		}) => next({
			hooksRouteLifeCycle: definition.hooksRouteLifeCycle
				? A.concat(lastValue.hooksRouteLifeCycle, definition.hooksRouteLifeCycle)
				: lastValue.hooksRouteLifeCycle,
			routeFunctionBuilders: definition.routeFunctionBuilders
				? A.concat(lastValue.routeFunctionBuilders, definition.routeFunctionBuilders)
				: lastValue.routeFunctionBuilders,
			stepFunctionBuilders: definition.stepFunctionBuilders
				? A.concat(lastValue.stepFunctionBuilders, definition.stepFunctionBuilders)
				: lastValue.stepFunctionBuilders,
			routes: definition.routes
				? A.concat(lastValue.routes, definition.routes)
				: lastValue.routes,
			hooksHubLifeCycle: definition.hooksHubLifeCycle
				? A.concat(lastValue.hooksHubLifeCycle, definition.hooksHubLifeCycle)
				: lastValue.hooksHubLifeCycle,
		}),
	);

	const hooksBeforeBuildRoute = pipe(
		hooksHubLifeCycle,
		A.map(({ beforeBuildRoute }) => beforeBuildRoute),
		A.filter(isType("function")),
	);

	const buildParams: BuildRouteFunctionParams = {
		environment,
		globalHooksRouteLifeCycle: hooksRouteLifeCycle,
		stepFunctionBuilders,
		routeFunctionBuilders,
	};

	const groupedRoute = await G.asyncReduce(
		routes,
		G.reduceFrom<GroupedRoute>({}),
		async({
			lastValue,
			element: route,
			nextWithObject,
		}) => {
			const routeAfterHook = await launchHookBeforeBuildRoute(
				hooksBeforeBuildRoute,
				route,
			);

			const buildedRoute = await buildRouteFunction(
				routeAfterHook,
				buildParams,
			);

			if (E.isLeft(buildedRoute)) {
				throw new RouterBuildError(
					unwrap(buildedRoute),
				);
			}

			return nextWithObject(
				lastValue,
				{
					[route.definition.method]: A.concat(
						lastValue[route.definition.method] ?? [],
						A.map(
							route.definition.paths,
							O.to({
								pattern: pathToRegExp,
								buildedRoute: justReturn(unwrap(buildedRoute)),
								matchedPath: forward,
							}),
						),
					),
				},
			);
		},
	);

	const buildedNotfoundRoute = await asyncPipe(
		createRoute({
			method: "GET",
			paths: ["/"],
			hooks: [],
			preflightSteps: [],
			steps: [hub.notfoundHandler],
		}),
		(route) => buildRouteFunction(
			route,
			buildParams,
		),
		E.whenIsLeft(
			(element) => {
				throw new RouterBuildError(element);
			},
		),
		unwrap,
	);

	const Request = hub.classRequest;

	return {
		exec: (initializationData) => {
			const routerElements = groupedRoute[initializationData.method];

			if (!routerElements) {
				return buildedNotfoundRoute(
					new Request({
						...initializationData,
						params: {},
						matchedPath: null,
					}),
				);
			}

			// eslint-disable-next-line @typescript-eslint/prefer-for-of
			for (let index = 0; index < routerElements.length; index++) {
				const routerElement = routerElements[index]!;
				const result = routerElement.pattern.exec(initializationData.path);

				if (!result) {
					continue;
				}

				return routerElement.buildedRoute(
					new Request({
						...initializationData,
						params: result.groups ?? {},
						matchedPath: routerElement.matchedPath,
					}),
				);
			}

			return buildedNotfoundRoute(
				new Request({
					...initializationData,
					params: {},
					matchedPath: null,
				}),
			);
		},
		hooksRouteLifeCycle,
		routeFunctionBuilders,
		routes,
		stepFunctionBuilders,
		hooksHubLifeCycle,
	};
}
