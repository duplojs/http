import { N } from "@duplojs/utils";
import type { CacheControlResponseDirectives, CacheControlRequestDirectives } from "./types";
import { directiveRequestParsers } from "./directiveRequestParsers";
import { createCacheControlResponseHeader } from "./createResponseHeader";
import { createHookRouteLifeCycle } from "@core/route";

export interface CreateCacheControllerProcessParams {
	response?: CacheControlResponseDirectives;
}

export function createCacheControllerHook(
	params?: CreateCacheControllerProcessParams,
) {
	const cacheControl = params?.response
		? createCacheControlResponseHeader(params.response)
		: null;

	return createHookRouteLifeCycle(
		({ request, addRequestProperties }) => {
			let cacheControl = "";

			if (typeof request.headers["cache-control"] === "string") {
				cacheControl = request.headers["cache-control"];
			} else if (request.headers["cache-control"] instanceof Array) {
				cacheControl = request.headers["cache-control"].join(",");
			}

			const cacheDirectiveStore: CacheControlRequestDirectives = {} as never;

			return addRequestProperties(
				{
					getCacheControlDirective: <
						GenericDirective extends keyof CacheControlRequestDirectives,
					>(
						directive: GenericDirective,
					) => {
						if (cacheDirectiveStore[directive] === undefined) {
							cacheDirectiveStore[directive] = directiveRequestParsers[directive](
								cacheControl,
							) as never;
						}

						return cacheDirectiveStore[directive];
					},
				},
			);
		},
		{
			beforeSendResponse: ({ currentResponse, next }) => {
				if (cacheControl && N.between(Number(currentResponse.code), 199, 399)) {
					currentResponse.setHeader("cache-control", cacheControl);
				}
				return next();
			},
		},
	);
}
