import { type ExpectType } from "@duplojs/utils";
import { type RouteHookParamsAfter, Request, useRouteBuilder, ResponseContract, PredictedResponse, hookRouteLifeCycleAddRequestProperties } from "@core";
import { useTestRouteFunctionBuilder } from "@test-utils/useTestRouteFunctionBuilder";
import { createBodyReader } from "@test-utils/bodyReader";
import { createCacheControllerHook } from "@plugin-cacheController/hooks/createCacheController/hook";
import type { CacheControlRequestDirectives } from "@plugin-cacheController/hooks/createCacheController/types";

describe("createCacheControllerHook", () => {
	it("hook test", () => {
		const hook = createCacheControllerHook({
			response: {
				maxAge: 120.9,
				sMaxAge: 30,
				public: true,
				noStore: true,
				mustRevalidate: true,
				staleWhileRevalidate: 15.8,
			},
		});

		const request = new Request({
			headers: {
				"cache-control": "max-age=300,no-cache",
			},
			host: "",
			matchedPath: "",
			method: "",
			origin: "",
			path: "",
			params: {},
			query: {},
			url: "",
			bodyReader: createBodyReader(),
		});

		const newRequest = hook.onConstructRequest({
			request,
			addRequestProperties: hookRouteLifeCycleAddRequestProperties(request),
		});

		expect(newRequest.getCacheControlDirective("maxAge")).toBe(300);
		expect(newRequest.getCacheControlDirective("maxAge")).toBe(300);
		expect(newRequest.getCacheControlDirective("noCache")).toBe(true);
		expect(newRequest.getCacheControlDirective("noStore")).toBe(false);

		const response = new PredictedResponse("204", "test", undefined);

		hook.beforeSendResponse({
			currentResponse: response,
			request: newRequest,
			next: () => null as never,
			exit: () => null as never,
		});

		expect(response.headers!["cache-control"])
			.toStrictEqual(
				"max-age=120,s-maxage=30,public,no-store,must-revalidate,stale-while-revalidate=15",
			);
	});

	it("cache-control header is array", () => {
		const hook = createCacheControllerHook();

		type CheckOutputOnConstructRequest = ExpectType<
			ReturnType<typeof hook.onConstructRequest>,
			Request & {
				getCacheControlDirective<
					GenericDirective extends keyof CacheControlRequestDirectives,
				>(
					directive: GenericDirective
				): CacheControlRequestDirectives[GenericDirective];
			},
			"strict"
		>;

		type CheckInputBeforeSendResponse = ExpectType<
			Parameters<typeof hook.beforeSendResponse>,
			[
				RouteHookParamsAfter<Request & {
					getCacheControlDirective<
						GenericDirective extends keyof CacheControlRequestDirectives,
					>(
						directive: GenericDirective,
					): CacheControlRequestDirectives[GenericDirective];
				}>,
			],
			"strict"
		>;

		const request = new Request({
			headers: {
				"cache-control": ["max-age=300", "no-cache"],
			},
			host: "",
			matchedPath: "",
			method: "",
			origin: "",
			path: "",
			params: {},
			query: {},
			url: "",
			bodyReader: createBodyReader(),
		});

		const newRequest = hook.onConstructRequest({
			request,
			addRequestProperties: hookRouteLifeCycleAddRequestProperties(request),
		});

		expect(newRequest.getCacheControlDirective("maxAge")).toBe(300);
	});
});
