import { type Hub, launchHookBeforeBuildRoute } from "@core/hub";
import { A, E, forward, G, isType, justReturn, O, pipe, unwrap } from "@duplojs/utils";
import { pathToRegExp } from "./pathToRegExp";
import { RouterBuildError } from "./buildError";
import { NotFoundBodyReaderImplementationError } from "./notFoundBodyReaderImplementationError";
import { buildRouteFunction, type BuildRouteFunctionParams, buildRouterFunction, type createRouteFunctionBuilder, type createStepFunctionBuilder, defaultCheckerStepFunctionBuilder, defaultCutStepFunctionBuilder, defaultExtractStepFunctionBuilder, defaultHandlerStepFunctionBuilder, defaultProcessStepFunctionBuilder, defaultRouteFunctionBuilder, defaultRouterFunctionBuilder } from "@core/functionsBuilders";
import { createRouterElementSystem } from "./createRouterElementSystem";
import { type RouterElementWrapper, type Router } from "./types";

export * from "./types";
export * from "./pathToRegExp";
export * from "./buildError";
export * from "./notFoundBodyReaderImplementationError";
export * from "./createRouterElementSystem";

export async function createRouter(hub: Hub): Promise<Router> {
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

	const routerElementWrapper = await G.asyncReduce(
		routes,
		G.reduceFrom<RouterElementWrapper>({}),
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

	const notfoundRouterElement = await createRouterElementSystem({
		handlerStep: hub.notfoundHandler,
		buildParams,
	});

	const malformedUrlRouterElement = await createRouterElementSystem({
		handlerStep: hub.malformedUrlHandler,
		buildParams,
	});

	return {
		exec: await buildRouterFunction({
			environment: hub.config.environment,
			routerElementWrapper,
			notfoundRouterElement: notfoundRouterElement,
			malformedUrlRouterElement: malformedUrlRouterElement,
			classRequest: hub.classRequest,
			routerFunctionBuilder: hub.routerFunctionBuilder ?? defaultRouterFunctionBuilder,
		}),
		hooksRouteLifeCycle,
		routeFunctionBuilders,
		routes,
		stepFunctionBuilders,
		hooksHubLifeCycle,
	};
}
