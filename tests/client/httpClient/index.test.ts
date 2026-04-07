vi.mock("@client/promiseRequest", () => ({
	PromiseRequest: vi.fn(),
}));

import { PromiseRequest } from "@client/promiseRequest";
import { autoCreateCacheKey, createHttpClient, type Hooks, httpClientKind } from "@client";
import { forward } from "@duplojs/utils";

describe("httpClient", () => {
	const httpClient = createHttpClient({
		baseUrl: "http://test.com",
	});

	beforeEach(() => {
		vi.clearAllMocks();
		httpClient.defaultHeaders.clear();
	});

	it("check http client value", () => {
		expect(httpClientKind.has(httpClient)).toBe(true);
		expect(httpClient.config).toStrictEqual({
			baseUrl: "http://test.com",
			disabledPredictedMode: false,
			informationHeaderKey: "information",
			predictedHeaderKey: "predicted",
			cache: undefined,
			credentials: undefined,
		});
		expect(httpClient.hooks).toStrictEqual({
			clientErrorResponseType: [],
			code: {},
			error: [],
			expectedResponse: [],
			information: {},
			informationalResponseType: [],
			notPredictedResponse: [],
			redirectionResponseType: [],
			request: [],
			response: [],
			serverErrorResponseType: [],
			successfulResponseType: [],
			startServerEvent: [],
			receiveEventServerEvent: [],
			errorServerEvent: [],
			closeServerEvent: [],
			beforeRetryServerEvent: [],
		});
	});

	it("addDefaultHeader", () => {
		httpClient.addDefaultHeader("test", () => "value");
		httpClient.addDefaultHeader("toto", "val");

		expect([...httpClient.defaultHeaders.entries()]).toStrictEqual([
			["test", expect.any(Function)],
			["toto", expect.any(Function)],
		]);
	});

	it("addDefaultHeaders", () => {
		httpClient.addDefaultHeaders({
			prop1: () => "1",
			prop2: "2",
		});

		expect([...httpClient.defaultHeaders.entries()]).toStrictEqual([
			["prop1", expect.any(Function)],
			["prop2", expect.any(Function)],
		]);
	});

	it("request", () => {
		httpClient.addDefaultHeaders({
			prop1: () => "1",
			prop2: "2",
			prop3: undefined,
		});

		void httpClient.request({
			method: "GET",
			path: "/test/ok",
		});

		expect(PromiseRequest).toHaveBeenCalledWith({
			baseUrl: "http://test.com",
			headers: {
				prop1: "1",
				prop2: "2",
			},
			abortController: expect.any(AbortController),
			hooks: {
				clientErrorResponseType: [],
				code: {},
				error: [],
				expectedResponse: [],
				information: {},
				informationalResponseType: [],
				notPredictedResponse: [],
				redirectionResponseType: [],
				request: [],
				response: [],
				serverErrorResponseType: [],
				successfulResponseType: [],
				startServerEvent: [],
				receiveEventServerEvent: [],
				errorServerEvent: [],
				closeServerEvent: [],
				beforeRetryServerEvent: [],
			},
			initParams: {
				cache: undefined,
				credentials: undefined,
			},
			predictedHeaderKey: "predicted",
			informationHeaderKey: "information",
			disabledPredicateMode: false,
			method: "GET",
			path: "/test/ok",
			cacheStore: httpClient.cacheStore,
			clientCache: undefined,
		});
	});

	it("request passes cache store and auto cache key builder", () => {
		void httpClient.request({
			method: "GET",
			path: "/test/ok",
			clientCache: "auto",
		});

		expect(PromiseRequest).toHaveBeenCalledWith({
			baseUrl: "http://test.com",
			headers: {},
			abortController: expect.any(AbortController),
			hooks: {
				clientErrorResponseType: [],
				code: {},
				error: [],
				expectedResponse: [],
				information: {},
				informationalResponseType: [],
				notPredictedResponse: [],
				redirectionResponseType: [],
				request: [],
				response: [],
				serverErrorResponseType: [],
				successfulResponseType: [],
				startServerEvent: [],
				receiveEventServerEvent: [],
				errorServerEvent: [],
				closeServerEvent: [],
				beforeRetryServerEvent: [],
			},
			initParams: {
				cache: undefined,
				credentials: undefined,
			},
			predictedHeaderKey: "predicted",
			informationHeaderKey: "information",
			disabledPredicateMode: false,
			method: "GET",
			path: "/test/ok",
			cacheStore: httpClient.cacheStore,
			clientCache: autoCreateCacheKey,
		});
	});

	it("request passes custom cache key builder unchanged", () => {
		const clientCache = vi.fn(() => "custom-key");

		void httpClient.request({
			method: "GET",
			path: "/test/ok",
			clientCache,
		});

		expect(PromiseRequest).toHaveBeenCalledWith({
			baseUrl: "http://test.com",
			headers: {},
			abortController: expect.any(AbortController),
			hooks: {
				clientErrorResponseType: [],
				code: {},
				error: [],
				expectedResponse: [],
				information: {},
				informationalResponseType: [],
				notPredictedResponse: [],
				redirectionResponseType: [],
				request: [],
				response: [],
				serverErrorResponseType: [],
				successfulResponseType: [],
				startServerEvent: [],
				receiveEventServerEvent: [],
				errorServerEvent: [],
				closeServerEvent: [],
				beforeRetryServerEvent: [],
			},
			initParams: {
				cache: undefined,
				credentials: undefined,
			},
			predictedHeaderKey: "predicted",
			informationHeaderKey: "information",
			disabledPredicateMode: false,
			method: "GET",
			path: "/test/ok",
			cacheStore: httpClient.cacheStore,
			clientCache,
		});
	});

	it("request passes cache control flags", () => {
		void httpClient.request({
			method: "GET",
			path: "/test/ok",
			bypassClientCache: true,
			refreshClientCache: true,
		});

		expect(PromiseRequest).toHaveBeenCalledWith({
			baseUrl: "http://test.com",
			headers: {},
			abortController: expect.any(AbortController),
			hooks: {
				clientErrorResponseType: [],
				code: {},
				error: [],
				expectedResponse: [],
				information: {},
				informationalResponseType: [],
				notPredictedResponse: [],
				redirectionResponseType: [],
				request: [],
				response: [],
				serverErrorResponseType: [],
				successfulResponseType: [],
				startServerEvent: [],
				receiveEventServerEvent: [],
				errorServerEvent: [],
				closeServerEvent: [],
				beforeRetryServerEvent: [],
			},
			initParams: {
				cache: undefined,
				credentials: undefined,
			},
			predictedHeaderKey: "predicted",
			informationHeaderKey: "information",
			disabledPredicateMode: false,
			method: "GET",
			path: "/test/ok",
			bypassClientCache: true,
			refreshClientCache: true,
			cacheStore: httpClient.cacheStore,
			clientCache: undefined,
		});
	});

	it("get", () => {
		void httpClient.get("/test/ok", {
			initParams: { cache: "default" },
		});

		expect(PromiseRequest).toHaveBeenCalledWith({
			baseUrl: "http://test.com",
			headers: {},
			abortController: expect.any(AbortController),
			hooks: {
				clientErrorResponseType: [],
				code: {},
				error: [],
				expectedResponse: [],
				information: {},
				informationalResponseType: [],
				notPredictedResponse: [],
				redirectionResponseType: [],
				request: [],
				response: [],
				serverErrorResponseType: [],
				successfulResponseType: [],
				startServerEvent: [],
				receiveEventServerEvent: [],
				errorServerEvent: [],
				closeServerEvent: [],
				beforeRetryServerEvent: [],
			},
			initParams: {
				cache: "default",
				credentials: undefined,
			},
			predictedHeaderKey: "predicted",
			informationHeaderKey: "information",
			disabledPredicateMode: false,
			method: "GET",
			path: "/test/ok",
			cacheStore: httpClient.cacheStore,
			clientCache: undefined,
		});
	});

	it("post", () => {
		void httpClient.post("/test/ok", {
			body: { prop1: "" },
		});

		expect(PromiseRequest).toHaveBeenCalledWith({
			baseUrl: "http://test.com",
			headers: {},
			abortController: expect.any(AbortController),
			hooks: {
				clientErrorResponseType: [],
				code: {},
				error: [],
				expectedResponse: [],
				information: {},
				informationalResponseType: [],
				notPredictedResponse: [],
				redirectionResponseType: [],
				request: [],
				response: [],
				serverErrorResponseType: [],
				successfulResponseType: [],
				startServerEvent: [],
				receiveEventServerEvent: [],
				errorServerEvent: [],
				closeServerEvent: [],
				beforeRetryServerEvent: [],
			},
			initParams: {
				cache: undefined,
				credentials: undefined,
			},
			predictedHeaderKey: "predicted",
			informationHeaderKey: "information",
			disabledPredicateMode: false,
			method: "POST",
			path: "/test/ok",
			body: { prop1: "" },
			cacheStore: httpClient.cacheStore,
			clientCache: undefined,
		});
	});

	it("put", () => {
		void httpClient.put("/test/ok", {
			body: { prop1: "" },
		});

		expect(PromiseRequest).toHaveBeenCalledWith({
			baseUrl: "http://test.com",
			headers: {},
			abortController: expect.any(AbortController),
			hooks: {
				clientErrorResponseType: [],
				code: {},
				error: [],
				expectedResponse: [],
				information: {},
				informationalResponseType: [],
				notPredictedResponse: [],
				redirectionResponseType: [],
				request: [],
				response: [],
				serverErrorResponseType: [],
				successfulResponseType: [],
				startServerEvent: [],
				receiveEventServerEvent: [],
				errorServerEvent: [],
				closeServerEvent: [],
				beforeRetryServerEvent: [],
			},
			initParams: {
				cache: undefined,
				credentials: undefined,
			},
			predictedHeaderKey: "predicted",
			informationHeaderKey: "information",
			disabledPredicateMode: false,
			method: "PUT",
			path: "/test/ok",
			body: { prop1: "" },
			cacheStore: httpClient.cacheStore,
			clientCache: undefined,
		});
	});

	it("patch", () => {
		void httpClient.patch("/test/ok", {
			body: { prop1: "" },
		});

		expect(PromiseRequest).toHaveBeenCalledWith({
			baseUrl: "http://test.com",
			headers: {},
			abortController: expect.any(AbortController),
			hooks: {
				clientErrorResponseType: [],
				code: {},
				error: [],
				expectedResponse: [],
				information: {},
				informationalResponseType: [],
				notPredictedResponse: [],
				redirectionResponseType: [],
				request: [],
				response: [],
				serverErrorResponseType: [],
				successfulResponseType: [],
				startServerEvent: [],
				receiveEventServerEvent: [],
				errorServerEvent: [],
				closeServerEvent: [],
				beforeRetryServerEvent: [],
			},
			initParams: {
				cache: undefined,
				credentials: undefined,
			},
			predictedHeaderKey: "predicted",
			informationHeaderKey: "information",
			disabledPredicateMode: false,
			method: "PATCH",
			path: "/test/ok",
			body: { prop1: "" },
			cacheStore: httpClient.cacheStore,
			clientCache: undefined,
		});
	});

	it("delete", () => {
		void httpClient.delete("/test/ok", {
			initParams: { credentials: "include" },
		});

		expect(PromiseRequest).toHaveBeenCalledWith({
			baseUrl: "http://test.com",
			headers: {},
			abortController: expect.any(AbortController),
			hooks: {
				clientErrorResponseType: [],
				code: {},
				error: [],
				expectedResponse: [],
				information: {},
				informationalResponseType: [],
				notPredictedResponse: [],
				redirectionResponseType: [],
				request: [],
				response: [],
				serverErrorResponseType: [],
				successfulResponseType: [],
				startServerEvent: [],
				receiveEventServerEvent: [],
				errorServerEvent: [],
				closeServerEvent: [],
				beforeRetryServerEvent: [],
			},
			initParams: {
				cache: undefined,
				credentials: "include",
			},
			predictedHeaderKey: "predicted",
			informationHeaderKey: "information",
			disabledPredicateMode: false,
			method: "DELETE",
			path: "/test/ok",
			cacheStore: httpClient.cacheStore,
			clientCache: undefined,
		});
	});

	describe("cache", () => {
		it("initializes cache store from client cache initial values", () => {
			const cachedClient = createHttpClient({
				baseUrl: "http://test.com",
				clientCacheInitialValues: {
					"cache-key": {
						body: { cached: true },
						code: "200",
						headers: { "content-type": "application/json" },
						information: "cached",
						ok: true,
						predicted: true,
						redirected: false,
						type: "basic",
						url: "http://test.com/test/ok",
					},
				},
			});

			expect([...cachedClient.cacheStore.entries()]).toStrictEqual([
				[
					"cache-key",
					{
						body: { cached: true },
						code: "200",
						headers: { "content-type": "application/json" },
						information: "cached",
						ok: true,
						predicted: true,
						redirected: false,
						type: "basic",
						url: "http://test.com/test/ok",
					},
				],
			]);
		});
	});

	describe("hooks", () => {
		const httpClient = createHttpClient({
			baseUrl: "http://test.com",
		});

		const infoHook: Hooks["information"][string][number] = vi.fn();
		const codeHook: Hooks["code"][string][number] = vi.fn();
		const requestHook: Hooks["request"][number] = vi.fn(forward);
		const responseHook: Hooks["response"][number] = vi.fn(forward);
		const responseTypeHook: Hooks["informationalResponseType"][number] = vi.fn();
		const expectedHook: Hooks["expectedResponse"][number] = vi.fn();
		const notPredictedHook: Hooks["notPredictedResponse"][number] = vi.fn();
		const errorHook: Hooks["error"][number] = vi.fn();
		const beforeRetryServerEvent: Hooks["beforeRetryServerEvent"][number] = vi.fn();
		const startServerEvent: Hooks["startServerEvent"][number] = vi.fn();
		const closeServerEvent: Hooks["closeServerEvent"][number] = vi.fn();
		const errorServerEvent: Hooks["errorServerEvent"][number] = vi.fn();
		const receiveEventServerEvent: Hooks["receiveEventServerEvent"][number] = vi.fn();

		httpClient.addRequestHook(requestHook);
		httpClient.addResponseHook(responseHook);
		httpClient.addInformationHook("info", infoHook);
		httpClient.addCodeHook("200", codeHook);
		httpClient.addInformationalResponseTypeHook(responseTypeHook);
		httpClient.addSuccessfulResponseTypeHook(responseTypeHook);
		httpClient.addRedirectionResponseTypeHook(responseTypeHook);
		httpClient.addClientErrorResponseTypeHook(responseTypeHook);
		httpClient.addServerErrorResponseTypeHook(responseTypeHook);
		httpClient.addExpectedResponseHook(expectedHook);
		httpClient.addNotPredictedResponseHook(notPredictedHook);
		httpClient.addErrorHook(errorHook);
		httpClient.addBeforeRetryServerEventHook(beforeRetryServerEvent);
		httpClient.addStartServerEventHook(startServerEvent);
		httpClient.addCloseServerEventHook(closeServerEvent);
		httpClient.addErrorServerEventHook(errorServerEvent);
		httpClient.addReceiveEventServerEventHook(receiveEventServerEvent);

		it("adds hooks to client registry", () => {
			expect(httpClient.hooks.request).toContain(requestHook);
			expect(httpClient.hooks.response).toContain(responseHook);
			expect(httpClient.hooks.information.info).toContain(infoHook);
			expect(httpClient.hooks.code["200"]).toContain(codeHook);
			expect(httpClient.hooks.informationalResponseType).toContain(responseTypeHook);
			expect(httpClient.hooks.successfulResponseType).toContain(responseTypeHook);
			expect(httpClient.hooks.redirectionResponseType).toContain(responseTypeHook);
			expect(httpClient.hooks.clientErrorResponseType).toContain(responseTypeHook);
			expect(httpClient.hooks.serverErrorResponseType).toContain(responseTypeHook);
			expect(httpClient.hooks.expectedResponse).toContain(expectedHook);
			expect(httpClient.hooks.notPredictedResponse).toContain(notPredictedHook);
			expect(httpClient.hooks.error).toContain(errorHook);
			expect(httpClient.hooks.beforeRetryServerEvent).toContain(beforeRetryServerEvent);
			expect(httpClient.hooks.startServerEvent).toContain(startServerEvent);
			expect(httpClient.hooks.closeServerEvent).toContain(closeServerEvent);
			expect(httpClient.hooks.errorServerEvent).toContain(errorServerEvent);
			expect(httpClient.hooks.receiveEventServerEvent).toContain(receiveEventServerEvent);
		});

		it("pass hook to PromiseRequest", () => {
			httpClient.addDefaultHeaders({
				prop1: () => "1",
				prop2: "2",
			});

			void httpClient.request({
				method: "GET",
				path: "/test/ok",
			});

			expect(PromiseRequest).toHaveBeenCalledWith({
				baseUrl: "http://test.com",
				headers: {
					prop1: "1",
					prop2: "2",
				},
				abortController: expect.any(AbortController),
				hooks: {
					clientErrorResponseType: [responseTypeHook],
					code: { 200: [codeHook] },
					error: [errorHook],
					expectedResponse: [expectedHook],
					information: { info: [infoHook] },
					informationalResponseType: [responseTypeHook],
					notPredictedResponse: [notPredictedHook],
					redirectionResponseType: [responseTypeHook],
					request: [requestHook],
					response: [responseHook],
					serverErrorResponseType: [responseTypeHook],
					successfulResponseType: [responseTypeHook],
					startServerEvent: [startServerEvent],
					receiveEventServerEvent: [receiveEventServerEvent],
					errorServerEvent: [errorServerEvent],
					closeServerEvent: [closeServerEvent],
					beforeRetryServerEvent: [beforeRetryServerEvent],
				},
				initParams: {
					cache: undefined,
					credentials: undefined,
				},
				predictedHeaderKey: "predicted",
				informationHeaderKey: "information",
				disabledPredicateMode: false,
				method: "GET",
				path: "/test/ok",
				cacheStore: httpClient.cacheStore,
				clientCache: undefined,
			});
		});
	});
});
