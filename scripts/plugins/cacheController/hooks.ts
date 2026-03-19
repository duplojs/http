import type { CacheControlDirectives } from "./types";
import { createCacheControlResponseHeader } from "./createResponseHeader";
import { createHookRouteLifeCycle } from "@core/route";

const eligibleCodeRegex = /^(?:2|3)/;

export function createCacheControllerHooks(
	params?: CacheControlDirectives,
) {
	const cacheControl = params
		? createCacheControlResponseHeader(params)
		: null;

	return createHookRouteLifeCycle(
		{
			beforeSendResponse: ({ currentResponse, next }) => {
				if (
					cacheControl
					&& eligibleCodeRegex.test(currentResponse.code)
					&& currentResponse.headers?.["cache-control"] === undefined
				) {
					currentResponse.setHeader("cache-control", cacheControl);
				}

				return next();
			},
		},
	);
}
