import { autoCreateCacheKey, findResponseFromCacheStore, type Hooks, saveResponseInCacheStore, type PromiseRequestParams } from "@client";
import { type ClientResponse } from "@client/types/clientResponse";

describe("clientCache", () => {
	const createHooks = (): Hooks => ({
		request: [],
		response: [],
		information: {},
		code: {},
		informationalResponseType: [],
		successfulResponseType: [],
		redirectionResponseType: [],
		clientErrorResponseType: [],
		serverErrorResponseType: [],
		expectedResponse: [],
		notPredictedResponse: [],
		error: [],
		beforeRetryServerEvent: [],
		closeServerEvent: [],
		errorServerEvent: [],
		receiveEventServerEvent: [],
		startServerEvent: [],
		closeStream: [],
		errorStream: [],
		receiveDataStream: [],
		startStream: [],
	});

	const createParams = (
		overrides: Partial<PromiseRequestParams> = {},
	): PromiseRequestParams => ({
		baseUrl: "http://test.local",
		method: "GET",
		path: "/resource/{id}",
		params: { id: "42" },
		query: {
			bb: "2",
			aa: "1",
		},
		body: { ok: true },
		headers: { authorization: "Bearer token" },
		hookParams: { traceId: "trace-01" },
		hooks: createHooks(),
		informationHeaderKey: "information",
		predictedHeaderKey: "predicted",
		disabledPredicateMode: false,
		abortController: new AbortController(),
		cacheStore: new Map(),
		clientCache: vi.fn(() => "cache-key"),
		...overrides,
	});

	const createResponse = (
		requestParams: PromiseRequestParams,
		overrides: Partial<ClientResponse> = {},
	): ClientResponse => ({
		code: "200",
		information: "cache hit",
		body: { result: true },
		ok: true,
		headers: new Headers({
			"content-type": "application/json",
			"x-test": "yes",
		}),
		type: "basic" as ResponseType,
		url: `${requestParams.baseUrl}/resource/42`,
		redirected: false,
		raw: new Response(),
		requestParams,
		predicted: true,
		...overrides,
	});

	it("autoCreateCacheKey serializes request params with sorted query entries", () => {
		const result = autoCreateCacheKey({
			method: "POST",
			path: "/users/{userId}",
			params: { userId: "24" },
			query: {
				zz: "last",
				aa: "first",
			},
			body: { role: "admin" },
			headers: { authorization: "token" },
			hookParams: { traceId: "trace-01" },
		});

		expect(result).toBe(
			JSON.stringify({
				method: "POST",
				path: "/users/24",
				query: [
					["aa", "first"],
					["zz", "last"],
				],
				body: { role: "admin" },
			}),
		);
	});

	it("autoCreateCacheKey serializes request params without query", () => {
		const result = autoCreateCacheKey({
			method: "POST",
			path: "/users/{userId}",
			params: { userId: "24" },
			query: undefined,
			body: { role: "admin" },
			headers: { authorization: "token" },
			hookParams: { traceId: "trace-01" },
		});

		expect(result).toBe(
			JSON.stringify({
				method: "POST",
				path: "/users/24",
				body: { role: "admin" },
			}),
		);
	});

	it("autoCreateCacheKey returns null when request params cannot be serialized", () => {
		const body: Record<string, unknown> = {};
		body.self = body;

		const result = autoCreateCacheKey({
			method: "POST",
			path: "/users/{userId}",
			params: { userId: "24" },
			query: {
				zz: "last",
				aa: "first",
			},
			body,
			headers: { authorization: "token" },
			hookParams: { traceId: "trace-01" },
		});

		expect(result).toBeNull();
	});

	it("findResponseFromCacheStore returns null when cache should be bypassed", () => {
		const clientCache = vi.fn(() => "cache-key");
		const result = findResponseFromCacheStore(
			createParams({
				clientCache,
				bypassClientCache: true,
			}),
		);

		expect(result).toBeNull();
		expect(clientCache).not.toHaveBeenCalled();
	});

	it("findResponseFromCacheStore returns null when cache should be refreshed", () => {
		const clientCache = vi.fn(() => "cache-key");
		const result = findResponseFromCacheStore(
			createParams({
				clientCache,
				refreshClientCache: true,
			}),
		);

		expect(result).toBeNull();
		expect(clientCache).not.toHaveBeenCalled();
	});

	it("findResponseFromCacheStore returns null when key is null or cache is missing", () => {
		const clientCache = vi.fn()
			.mockReturnValueOnce(null)
			.mockReturnValueOnce("cache-key");
		const requestParams = createParams({
			clientCache,
			cacheStore: new Map(),
		});

		const resultWithNullKey = findResponseFromCacheStore({
			...requestParams,
		});
		const resultWithMissingEntry = findResponseFromCacheStore(requestParams);

		expect(resultWithNullKey).toBeNull();
		expect(resultWithMissingEntry).toBeNull();
		expect(clientCache).toHaveBeenCalledTimes(2);
		expect(clientCache).toHaveBeenNthCalledWith(1, {
			method: requestParams.method,
			path: requestParams.path,
			body: requestParams.body,
			headers: requestParams.headers,
			hookParams: requestParams.hookParams,
			params: requestParams.params,
			query: requestParams.query,
		});
	});

	it("findResponseFromCacheStore rebuilds a client response from cache", () => {
		const requestParams = createParams({
			cacheStore: new Map([
				[
					"cache-key",
					{
						body: { cached: true },
						code: "201",
						headers: {
							"content-type": "application/json",
							"x-cache": "hit",
						},
						information: "cached",
						ok: true,
						predicted: false,
						redirected: true,
						type: "cors",
						url: "http://cache.local/resource/42",
					},
				],
			]),
		});

		const result = findResponseFromCacheStore(requestParams);

		expect(result).not.toBeNull();
		expect(result).toMatchObject({
			body: { cached: true },
			code: "201",
			information: "cached",
			ok: true,
			predicted: false,
			redirected: true,
			type: "cors",
			url: "http://cache.local/resource/42",
			requestParams,
			fromCache: true,
		});
		expect(result?.headers).toBeInstanceOf(Headers);
		expect(result?.headers.get("x-cache")).toBe("hit");
		expect(result?.raw).toBeInstanceOf(Response);
		expect(result?.raw.headers.get("content-type")).toBe("application/json");
	});

	it("saveResponseInCacheStore stores the serializable response fields", () => {
		const cacheStore = new Map();
		const clientCache = vi.fn(() => "cache-key");
		const requestParams = createParams({
			cacheStore,
			clientCache,
		});
		const response = createResponse(requestParams, {
			code: "202",
			information: undefined,
			body: { saved: true },
			ok: null,
			type: "opaque" as ResponseType,
			url: "http://test.local/saved",
			redirected: true,
			predicted: false,
		});

		saveResponseInCacheStore(requestParams, response);

		expect(clientCache).toHaveBeenCalledWith({
			method: requestParams.method,
			path: requestParams.path,
			body: requestParams.body,
			headers: requestParams.headers,
			hookParams: requestParams.hookParams,
			params: requestParams.params,
			query: requestParams.query,
		});
		expect(cacheStore.get("cache-key")).toStrictEqual({
			body: { saved: true },
			code: "202",
			headers: {
				"content-type": "application/json",
				"x-test": "yes",
			},
			information: undefined,
			ok: null,
			predicted: false,
			redirected: true,
			type: "opaque",
			url: "http://test.local/saved",
		});
	});

	it("saveResponseInCacheStore skips when cache key creation is disabled or bypassed", () => {
		const cacheStore = new Map();
		const setSpy = vi.spyOn(cacheStore, "set");

		saveResponseInCacheStore(
			createParams({
				cacheStore,
				clientCache: undefined,
			}),
			createResponse(createParams()),
		);

		saveResponseInCacheStore(
			createParams({
				cacheStore,
				clientCache: vi.fn(() => null),
			}),
			createResponse(createParams()),
		);

		saveResponseInCacheStore(
			createParams({
				cacheStore,
				clientCache: vi.fn(() => "cache-key"),
				bypassClientCache: true,
			}),
			createResponse(createParams()),
		);

		expect(setSpy).not.toHaveBeenCalled();
	});
});
