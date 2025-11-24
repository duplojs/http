import { type Hub, launchHookBeforeBuildRoute } from "@core/hub";
import { type BuildedRouter } from "./types";
import { A, asyncPipe, E, forward, G, isType, justReturn, O, pipe, unwrap } from "@duplojs/utils";
import { type BuildedRoute } from "@core/route/types";
import { pathToRegExp } from "./pathToRegExp";
import { createRoute } from "@core/route";
import { RouterBuildError } from "./buildError";
import { buildRouteFunction, type BuildRouteFunctionParams, defaultRouteFunctionBuilder } from "@core/functionsBuilders/route";
import { defaultCheckerStepFunctionBuilder, defaultCutStepFunctionBuilder, defaultExtractStepFunctionBuilder, defaultHandlerStepFunctionBuilder, defaultProcessStepFunctionBuilder } from "@core/functionsBuilders/steps";
import { decodeUrl } from "./decodeUrl";

export * from "./types";
export * from "./pathToRegExp";
export * from "./buildError";
export * from "./decodeUrl";

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
	const hub = inputHub
		.addRouteFunctionBuilder(defaultRouteFunctionBuilder)
		.addStepFunctionBuilder([
			defaultCheckerStepFunctionBuilder,
			defaultCutStepFunctionBuilder,
			defaultHandlerStepFunctionBuilder,
			defaultExtractStepFunctionBuilder,
			defaultProcessStepFunctionBuilder,
		]);

	const { environment } = hub.config;
	const {
		hooksRouteLifeCycle,
		routeFunctionBuilders,
		routes,
		stepFunctionBuilders,
		hooksHubLifeCycle,
	} = hub.aggregates();

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
			const decodedUrl = decodeUrl(initializationData.url);

			if (!routerElements) {
				return buildedNotfoundRoute(
					new Request({
						...initializationData,
						...decodedUrl,
						params: {},
						matchedPath: null,
					}),
				);
			}

			// eslint-disable-next-line @typescript-eslint/prefer-for-of
			for (let index = 0; index < routerElements.length; index++) {
				const routerElement = routerElements[index]!;
				const result = routerElement.pattern.exec(decodedUrl.path);

				if (!result) {
					continue;
				}

				return routerElement.buildedRoute(
					new Request({
						...initializationData,
						...decodedUrl,
						params: result.groups ?? {},
						matchedPath: routerElement.matchedPath,
					}),
				);
			}

			return buildedNotfoundRoute(
				new Request({
					...initializationData,
					...decodedUrl,
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
