import { S } from "@duplojs/utils";
import type { CacheControlDirectives } from "../types";
import { createCacheControlResponseHeader } from "./createResponseHeader";
import { createHookRouteLifeCycle } from "@core/route";

const eligibleCodeRegex = /^(?:2|3)/;

export function createCacheControllerHook(
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
					&& S.test(currentResponse.code, eligibleCodeRegex)
				) {
					currentResponse.setHeader("cache-control", cacheControl);
				}

				return next();
			},
		},
	);
}
