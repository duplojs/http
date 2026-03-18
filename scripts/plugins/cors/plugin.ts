/* eslint-disable @typescript-eslint/prefer-for-of */
import { type AnyTuple, type MaybePromise, G, pipe, toRegExp, A, type O } from "@duplojs/utils";
import { type RequestMethods, type Request } from "@core/request";
import type { Response } from "@core/response";
import { type HubPlugin } from "@core/hub";
import { IgnoreRouteCorsMetadata } from "./metadata";
import { createHookRouteLifeCycle, createRoute } from "@core/route";
import { allowHeadersFunction, allowMethodsFunction, allowOriginFunction, credentialsFunction, exposeHeadersFunction, maxAgeFunction, varyFunction } from "./headerFunctions";

export interface CorsPluginParams {
	readonly allowOrigin?: string | RegExp | AnyTuple<string> | ((origin: string) => MaybePromise<boolean>) | true;
	readonly allowHeaders?: string | AnyTuple<string> | true;
	readonly exposeHeaders?: string | AnyTuple<string>;
	readonly maxAge?: number;
	readonly credentials?: boolean;
	readonly allowMethods?: RequestMethods | AnyTuple<RequestMethods> | true;
}

export function corsPlugin<
	GenericParams extends CorsPluginParams,
>(params: GenericParams & O.RequireAtLeastOne<GenericParams>) {
	const headerFunctionOtherRoutes: ((request: Request, response: Response) => void)[] = [];

	if (params.allowOrigin) {
		headerFunctionOtherRoutes.push(
			varyFunction.default(),
		);

		headerFunctionOtherRoutes.push(
			typeof params.allowOrigin === "function"
				? allowOriginFunction.isFunction(params.allowOrigin)
				: allowOriginFunction.default(
					toRegExp(
						params.allowOrigin === true
							? "*"
							: params.allowOrigin,
					),
				),
		);
	}

	if (params.exposeHeaders) {
		headerFunctionOtherRoutes.push(
			pipe(
				params.exposeHeaders,
				A.coalescing,
				A.join(","),
				exposeHeadersFunction.default,
			),
		);
	}

	if (params.credentials) {
		headerFunctionOtherRoutes.push(
			credentialsFunction.default(),
		);
	}

	const hookOtherRoute = createHookRouteLifeCycle({
		beforeSendResponse: (params) => {
			for (let index = 0; index < headerFunctionOtherRoutes.length; index++) {
				headerFunctionOtherRoutes[index]!(params.request, params.currentResponse);
			}
			return params.next();
		},
	});

	return (): HubPlugin => ({
		name: "cors",
		hooksHubLifeCycle: [
			{
				beforeBuildRoute: (route) => {
					if (route.definition.metadata.some(IgnoreRouteCorsMetadata.is)) {
						return route;
					}
					return {
						...route,
						definition: {
							...route.definition,
							hooks: [hookOtherRoute, ...route.definition.hooks],
						},
					};
				},
				beforeServerBuildRoutes: (hub) => {
					const headerFunctionRouteOptions: ((request: Request, response: Response) => void)[] = [];

					if (params.allowMethods === true) {
						const allowMethodsFunctionIsBool = pipe(
							hub.routes,
							G.map(
								(route) => A.map(
									route.definition.paths,
									(path) => ({
										path,
										method: route.definition.method,
									}),
								),
							),
							G.flat,
							G.reduce(
								G.reduceFrom<Record<string, string>>({}),
								({ element, lastValue, next }) => {
									lastValue[element.path] = lastValue[element.path]
										? `${lastValue[element.path]},${element.method}`
										: element.method;
									return next(lastValue);
								},
							),
							allowMethodsFunction.isBool,
						);

						headerFunctionRouteOptions.push(allowMethodsFunctionIsBool);
					} else if (params.allowMethods) {
						headerFunctionRouteOptions.push(
							pipe(
								params.allowMethods,
								A.coalescing,
								A.join(","),
								allowMethodsFunction.default,
							),
						);
					}

					if (params.allowHeaders) {
						headerFunctionRouteOptions.push(
							allowHeadersFunction.default(
								params.allowHeaders === true
									? "*"
									: pipe(
										params.allowHeaders,
										A.coalescing,
										A.join(","),
									),
							),
						);
					}

					if (params.maxAge) {
						headerFunctionRouteOptions.push(
							maxAgeFunction.default(params.maxAge.toString()),
						);
					}

					const hookRouteOptions = createHookRouteLifeCycle({
						beforeRouteExecution: (params) => {
							const response = params.response("204", "cors");
							for (let index = 0; index < headerFunctionRouteOptions.length; index++) {
								headerFunctionRouteOptions[index]!(params.request, response);
							}
							return response;
						},
					});

					const routeOptions = createRoute({
						paths: ["/*"],
						method: "OPTIONS",
						hooks: [hookRouteOptions],
						metadata: [IgnoreRouteCorsMetadata()],
						steps: [],
						preflightSteps: [],
						bodyController: null,
					});

					hub.routes.add(routeOptions);

					return hub;
				},
			},
		],
	});
}
