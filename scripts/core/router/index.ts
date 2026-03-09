import { type Hub, launchHookBeforeBuildRoute } from "@core/hub";
import { type BuildedRouter } from "./types";
import { A, E, forward, G, isType, justReturn, O, pipe, unwrap } from "@duplojs/utils";
import { type BuildedRoute } from "@core/route/types";
import { pathToRegExp } from "./pathToRegExp";
import { RouterBuildError } from "./buildError";
import { buildRouteFunction, type createRouteFunctionBuilder, defaultRouteFunctionBuilder, type BuildRouteFunctionParams } from "@core/functionsBuilders/route";
import { decodeUrl } from "./decodeUrl";
import { type BodyReader } from "@core/request";
import { NotFoundBodyReaderImplementationError } from "./notFoundBodyReaderImplementationError";
import { type createStepFunctionBuilder, defaultCheckerStepFunctionBuilder, defaultCutStepFunctionBuilder, defaultExtractStepFunctionBuilder, defaultHandlerStepFunctionBuilder, defaultProcessStepFunctionBuilder } from "@core/functionsBuilders";
import { createDefaultMalformedUrlRoute, createDefaultNotfoundRoute } from "./defaultRoutes";

export * from "./types";
export * from "./pathToRegExp";
export * from "./buildError";
export * from "./decodeUrl";
export * from "./notFoundBodyReaderImplementationError";

interface RouterElement {
	pattern: RegExp;
	matchedPath: string;
	bodyReader: BodyReader;
	buildedRoute: BuildedRoute;
}

type GroupedRoute = Record<
	string,
	RouterElement[]
>;

export async function buildRouter(hub: Hub): Promise<BuildedRouter> {
	const { environment } = hub.config;
	const {
		hooksRouteLifeCycle,
		routes,
		hooksHubLifeCycle,
		bodyReaderImplementations,
	} = hub;

	const routeFunctionBuilders: readonly ReturnType<typeof createRouteFunctionBuilder>[] = [
		...hub.routeFunctionBuilders,
		defaultRouteFunctionBuilder,
	];
	const stepFunctionBuilders: readonly ReturnType<typeof createStepFunctionBuilder>[] = [
		...hub.stepFunctionBuilders,
		defaultCheckerStepFunctionBuilder,
		defaultCutStepFunctionBuilder,
		defaultHandlerStepFunctionBuilder,
		defaultExtractStepFunctionBuilder,
		defaultProcessStepFunctionBuilder,
	];

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
		defaultExtractContract: hub.defaultExtractContract,
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
					route,
					unwrap(buildedRoute),
				);
			}

			const routeBodyController = route.definition.bodyController ?? hub.defaultBodyController;

			const bodyReader = pipe(
				bodyReaderImplementations,
				A.reduce(
					A.reduceFrom<null>(null),
					({ element, next, exit }) => pipe(
						element,
						routeBodyController.tryToCreateReader,
						E.whenIsRight(exit),
						E.whenIsLeft(justReturn(next(null))),
					),
				),
			);

			if (!bodyReader) {
				throw new NotFoundBodyReaderImplementationError(
					route,
					routeBodyController,
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
								bodyReader: justReturn(bodyReader),
							}),
						),
					),
				},
			);
		},
	);

	const defaultNotfoundRoute = await createDefaultNotfoundRoute({
		hub,
		buildParams,
	});

	const defaultMalformedUrlRoute = await createDefaultMalformedUrlRoute({
		hub,
		buildParams,
	});

	const Request = hub.classRequest;

	return {
		exec: (initializationData) => {
			const routerElements = groupedRoute[initializationData.method];
			const decodedUrl = decodeUrl(initializationData.url);

			if (!decodedUrl) {
				return defaultMalformedUrlRoute.buildedRoute(
					new Request({
						...initializationData,
						params: {},
						path: "",
						query: {},
						matchedPath: null,
						bodyReader: defaultMalformedUrlRoute.bodyReader,
					}),
				);
			}

			if (!routerElements) {
				return defaultNotfoundRoute.buildedRoute(
					new Request({
						...initializationData,
						...decodedUrl,
						params: {},
						matchedPath: null,
						bodyReader: defaultNotfoundRoute.bodyReader,
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
						bodyReader: routerElement.bodyReader,
					}),
				);
			}

			return defaultNotfoundRoute.buildedRoute(
				new Request({
					...initializationData,
					...decodedUrl,
					params: {},
					matchedPath: null,
					bodyReader: defaultNotfoundRoute.bodyReader,
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
