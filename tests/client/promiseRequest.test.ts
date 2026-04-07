import { type ClientCacheStore, type Hooks, type PromiseRequestParams } from "@client";
import { PromiseRequest } from "@client/promiseRequest";
import { type AllClientResponse, type ClientResponse } from "@client/types/clientResponse";
import { UnexpectedCodeResponseError, UnexpectedInformationResponseError, UnexpectedResponseError, UnexpectedResponseTypeError } from "@client/unexpectedResponseError";
import { asserts, unwrap, E, createFormData, sleep } from "@duplojs/utils";

describe("PromiseRequest", () => {
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
	});

	const createParams = (overrides: Partial<PromiseRequestParams> = {}): PromiseRequestParams => ({
		baseUrl: "http://test.local",
		method: "GET",
		path: "/resource",
		headers: {},
		hooks: createHooks(),
		informationHeaderKey: "information",
		predictedHeaderKey: "predicted",
		disabledPredicateMode: false,
		abortController: new AbortController(),
		cacheStore: new Map(),
		...overrides,
	});

	const createResponse = (
		params: PromiseRequestParams,
		overrides: Partial<AllClientResponse> = {},
	): ClientResponse => ({
		code: "200",
		information: undefined,
		body: { ok: true },
		ok: true,
		headers: new Headers(),
		type: "basic" as ResponseType,
		url: `${params.baseUrl}${params.path}`,
		redirected: false,
		raw: {} as Response,
		requestParams: params,
		predicted: true,
		...overrides,
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	});

	it("static fetch uses global fetch and builds response or error", async() => {
		const jsonResponse = {
			status: 200,
			ok: true,
			statusText: "OK",
			headers: new Headers({
				"content-type": "application/json",
				information: "info",
				predicted: "true",
			}),
			json: vi.fn().mockResolvedValue({ value: 1 }),
			text: vi.fn(),
			formData: vi.fn(),
			blob: vi.fn(),
			type: "basic",
			url: "http://test.local/resource",
			redirected: false,
		} as unknown as Response;

		const errorResponse = {
			status: 500,
			ok: false,
			statusText: "ERR",
			headers: new Headers({ "content-type": "text/plain" }),
			json: vi.fn(),
			text: vi.fn().mockResolvedValue("error"),
			formData: vi.fn(),
			blob: vi.fn(),
			type: "basic",
			url: "http://test.local/resource",
			redirected: false,
		} as unknown as Response;

		const seeResponse = {
			...jsonResponse,
			status: 204,
			headers: new Headers({
				"content-type": "text/event-stream",
				information: "info",
				predicted: "true",
			}),
		} as unknown as Response;

		const fetchMock = vi.fn()
			.mockResolvedValueOnce(jsonResponse)
			.mockResolvedValueOnce(jsonResponse)
			.mockResolvedValueOnce(jsonResponse)
			.mockResolvedValueOnce(errorResponse)
			.mockResolvedValueOnce(jsonResponse)
			.mockResolvedValueOnce(jsonResponse)
			.mockResolvedValueOnce(jsonResponse)
			.mockResolvedValueOnce(jsonResponse)
			.mockResolvedValueOnce(seeResponse)
			.mockRejectedValueOnce(new Error("network"));

		vi.stubGlobal("fetch", fetchMock);

		const paramsWithQuery = createParams({
			path: "/resource/{id}",
			params: { id: "42" },
			query: { qq: "search" },
			body: "text-body",
		});

		const paramsWithObject = createParams({
			body: { key: "value" },
		});

		const paramsWithBoolean = createParams({
			body: true,
		});

		const paramsWithNumber = createParams({
			body: 1,
		});

		const paramsWithHeader = createParams({
			headers: { "content-type": "application/json" },
			body: { key: "value" },
		});

		const paramsWithFormData = createParams({
			body: new FormData(),
		});

		const paramsWithTheFormData = createParams({
			body: createFormData({}),
		});

		const paramsWithArray = createParams({
			body: ["test"],
		});

		const result = await PromiseRequest.fetch(paramsWithQuery);
		const resultObject = await PromiseRequest.fetch(paramsWithObject);
		const resultBoolean = await PromiseRequest.fetch(paramsWithBoolean);
		const resultNumber = await PromiseRequest.fetch(paramsWithNumber);
		const resultHeader = await PromiseRequest.fetch(paramsWithHeader);
		const resultFormData = await PromiseRequest.fetch(paramsWithFormData);
		const resultTheFormData = await PromiseRequest.fetch(paramsWithTheFormData);
		const resultArray = await PromiseRequest.fetch(paramsWithArray);
		const resultSEE = await PromiseRequest.fetch(createParams());
		const resultError = await PromiseRequest.fetch(createParams());

		expect(fetchMock).toHaveBeenNthCalledWith(
			1,
			"http://test.local/resource/42?qq=search",
			expect.objectContaining({
				method: "GET",
			}),
		);
		expect(fetchMock).toHaveBeenNthCalledWith(
			7,
			"http://test.local/resource",
			expect.objectContaining({
				method: "GET",
				headers: {
					"content-type-options": "advanced",
				},
			}),
		);

		asserts(result, E.isRight);
		asserts(resultObject, E.isRight);
		asserts(resultBoolean, E.isRight);
		asserts(resultNumber, E.isRight);
		asserts(resultHeader, E.isRight);
		asserts(resultFormData, E.isRight);
		asserts(resultTheFormData, E.isRight);
		asserts(resultArray, E.isRight);
		asserts(resultSEE, E.isRight);
		asserts(resultError, E.isLeft);

		expect(unwrap(result).body).toStrictEqual({ value: 1 });
		expect(unwrap(result).information).toBe("info");
		expect(unwrap(result).predicted).toBe(true);
		expect(unwrap(resultObject).ok).toBe(true);
		expect(unwrap(resultBoolean).ok).toBe(true);
		expect(unwrap(resultNumber).ok).toBeNull();
		expect(unwrap(resultNumber).predicted).toBe(false);
		expect(unwrap(resultHeader).ok).toBe(true);
		expect(Symbol.asyncIterator in unwrap(resultSEE)).toBe(true);
	});

	it("static fetch returns cached response without calling fetch", async() => {
		const requestParams = createParams({
			clientCache: vi.fn(() => "cache-key"),
			cacheStore: new Map([
				[
					"cache-key",
					{
						body: { cached: true },
						code: "200",
						headers: {
							"content-type": "application/json",
							"x-cache": "hit",
						},
						information: "cached",
						ok: true,
						predicted: false,
						redirected: false,
						type: "basic",
						url: "http://test.local/resource",
					},
				],
			]),
		});
		const fetchMock = vi.fn();

		vi.stubGlobal("fetch", fetchMock);

		const result = await PromiseRequest.fetch(requestParams);

		asserts(result, E.isRight);
		expect(fetchMock).not.toHaveBeenCalled();
		expect(unwrap(result)).toMatchObject({
			body: { cached: true },
			code: "200",
			information: "cached",
			ok: true,
			predicted: false,
			requestParams,
		});
		expect(unwrap(result).headers).toBeInstanceOf(Headers);
	});

	it("static fetch refreshes cache by bypassing lookup and saving fresh response", async() => {
		const fetchMock = vi.fn().mockResolvedValue({
			status: 200,
			ok: true,
			statusText: "OK",
			headers: new Headers({
				"content-type": "application/json",
				information: "fresh-info",
				predicted: "true",
			}),
			json: vi.fn().mockResolvedValue({ fresh: true }),
			text: vi.fn(),
			formData: vi.fn(),
			blob: vi.fn(),
			type: "basic",
			url: "http://test.local/resource",
			redirected: false,
		} as unknown as Response);
		const clientCache = vi.fn(() => "cache-key");
		const cacheStore: ClientCacheStore = new Map([
			[
				"cache-key",
				{
					body: { stale: true },
					code: "200",
					headers: { "content-type": "application/json" },
					information: "stale-info",
					ok: true,
					predicted: false,
					redirected: false,
					type: "basic" as ResponseType,
					url: "http://test.local/resource",
				},
			],
		]);
		const requestParams = createParams({
			clientCache,
			cacheStore,
			refreshClientCache: true,
		});

		vi.stubGlobal("fetch", fetchMock);

		const result = await PromiseRequest.fetch(requestParams);

		asserts(result, E.isRight);
		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(unwrap(result).body).toStrictEqual({ fresh: true });
		expect(cacheStore.get("cache-key")).toStrictEqual({
			body: { fresh: true },
			code: "200",
			headers: {
				"content-type": "application/json",
				information: "fresh-info",
				predicted: "true",
			},
			information: "fresh-info",
			ok: true,
			predicted: true,
			redirected: false,
			type: "basic",
			url: "http://test.local/resource",
		});
	});

	it("static fetch saves successful responses in cache store", async() => {
		const fetchMock = vi.fn().mockResolvedValue({
			status: 200,
			ok: true,
			statusText: "OK",
			headers: new Headers({
				"content-type": "application/json",
				information: "info",
				predicted: "true",
			}),
			json: vi.fn().mockResolvedValue({ value: 1 }),
			text: vi.fn(),
			formData: vi.fn(),
			blob: vi.fn(),
			type: "basic",
			url: "http://test.local/resource",
			redirected: false,
		} as unknown as Response);
		const cacheStore = new Map();
		const clientCache = vi.fn(() => "cache-key");
		const requestParams = createParams({
			method: "POST",
			body: { value: 1 },
			cacheStore,
			clientCache,
		});

		vi.stubGlobal("fetch", fetchMock);

		const result = await PromiseRequest.fetch(requestParams);

		asserts(result, E.isRight);
		expect(fetchMock).toHaveBeenCalledTimes(1);
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
			body: { value: 1 },
			code: "200",
			headers: {
				"content-type": "application/json",
				information: "info",
				predicted: "true",
			},
			information: "info",
			ok: true,
			predicted: true,
			redirected: false,
			type: "basic",
			url: "http://test.local/resource",
		});
	});

	it("static fetch does not read or write cache when bypassClientCache is enabled", async() => {
		const fetchMock = vi.fn().mockResolvedValue({
			status: 200,
			ok: true,
			statusText: "OK",
			headers: new Headers({
				"content-type": "application/json",
				information: "info",
				predicted: "true",
			}),
			json: vi.fn().mockResolvedValue({ live: true }),
			text: vi.fn(),
			formData: vi.fn(),
			blob: vi.fn(),
			type: "basic",
			url: "http://test.local/resource",
			redirected: false,
		} as unknown as Response);
		const clientCache = vi.fn(() => "cache-key");
		const cacheStore: ClientCacheStore = new Map([
			[
				"cache-key",
				{
					body: { cached: true },
					code: "200",
					headers: { "content-type": "application/json" },
					information: "cached",
					ok: true,
					predicted: false,
					redirected: false,
					type: "basic" as ResponseType,
					url: "http://test.local/resource",
				},
			],
		]);
		const requestParams = createParams({
			clientCache,
			cacheStore,
			bypassClientCache: true,
		});

		vi.stubGlobal("fetch", fetchMock);

		const result = await PromiseRequest.fetch(requestParams);

		asserts(result, E.isRight);
		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(clientCache).not.toHaveBeenCalled();
		expect(unwrap(result).body).toStrictEqual({ live: true });
		expect(cacheStore.get("cache-key")).toStrictEqual({
			body: { cached: true },
			code: "200",
			headers: { "content-type": "application/json" },
			information: "cached",
			ok: true,
			predicted: false,
			redirected: false,
			type: "basic",
			url: "http://test.local/resource",
		});
	});

	it("addRequestInterceptor", async() => {
		const params = createParams();
		const response = createResponse(params, { code: "600" });
		const fetchSpy = vi.spyOn(PromiseRequest, "fetch").mockImplementation((nextParams) => {
			expect(nextParams.method).toBe("POST");
			return Promise.resolve(E.right("response", response));
		});

		const request = new PromiseRequest(params);
		const interceptor = vi.fn((nextParams: PromiseRequestParams) => ({
			...nextParams,
			method: "POST",
		}));

		const result = request.addRequestInterceptor(interceptor);
		await request;

		expect(result).toBe(request);
		expect(interceptor).toHaveBeenCalledTimes(1);
		expect(fetchSpy).toHaveBeenCalledTimes(1);
	});

	it("addResponseInterceptor", async() => {
		const params = createParams();
		const response = createResponse(params, { code: "200" });
		vi.spyOn(PromiseRequest, "fetch").mockResolvedValue(E.right("response", response));

		const request = new PromiseRequest(params);
		const interceptor = vi.fn((nextResponse: ClientResponse) => ({
			...nextResponse,
			code: "201",
		} as ClientResponse));

		const result = request.addResponseInterceptor(interceptor);
		const maybeResponse = await request;

		asserts(maybeResponse, E.isRight);
		expect(result).toBe(request);
		expect(interceptor).toHaveBeenCalledWith(response);
		expect(unwrap(maybeResponse).code).toBe("201");
	});

	it("whenNotPredictedResponse", async() => {
		const params = createParams({ disabledPredicateMode: false });
		const response = createResponse(params, { predicted: false });
		vi.spyOn(PromiseRequest, "fetch").mockResolvedValue(E.right("response", response));

		const request = new PromiseRequest(params);
		const hook = vi.fn();
		const successHook = vi.fn();
		const result = request
			.whenNotPredictedResponse(hook)
			.whenSuccessfulResponse(successHook);
		const maybeResponse = await request;

		asserts(maybeResponse, E.isRight);
		expect(result).toBe(request);
		expect(hook).toHaveBeenCalledWith(response);
		expect(successHook).not.toHaveBeenCalled();
	});

	it("whenInformation", async() => {
		const params = createParams();
		const response = createResponse(params, { information: "info-1" });
		vi.spyOn(PromiseRequest, "fetch").mockResolvedValue(E.right("response", response));

		const request = new PromiseRequest(params);
		const hook = vi.fn();
		const result = request.whenInformation(["info-1", "info-2"], hook);
		await request;

		expect(result).toBe(request);
		expect(request.hooks.information?.["info-1"]).toContain(hook);
		expect(request.hooks.information?.["info-2"]).toContain(hook);
		expect(hook).toHaveBeenCalledWith(response);
	});

	it("whenCode", async() => {
		const params = createParams();
		const response = createResponse(params, { code: "201" });
		vi.spyOn(PromiseRequest, "fetch").mockResolvedValue(E.right("response", response));

		const request = new PromiseRequest(params);
		const hook = vi.fn();
		const result = request.whenCode(["201", "202"], hook);
		await request;

		expect(result).toBe(request);
		expect(request.hooks.code?.["201"]).toContain(hook);
		expect(request.hooks.code?.["202"]).toContain(hook);
		expect(hook).toHaveBeenCalledWith(response);
	});

	it("whenInformationalResponse", async() => {
		const params = createParams();
		const response = createResponse(params, { code: "102" });
		vi.spyOn(PromiseRequest, "fetch").mockResolvedValue(E.right("response", response));

		const request = new PromiseRequest(params);
		const hook = vi.fn();
		const result = request.whenInformationalResponse(hook);
		await request;

		expect(result).toBe(request);
		expect(hook).toHaveBeenCalledWith(response);
	});

	it("whenSuccessfulResponse", async() => {
		const params = createParams();
		const response = createResponse(params, { code: "200" });
		vi.spyOn(PromiseRequest, "fetch").mockResolvedValue(E.right("response", response));

		const request = new PromiseRequest(params);
		const hook = vi.fn();
		const result = request.whenSuccessfulResponse(hook);
		await request;

		expect(result).toBe(request);
		expect(hook).toHaveBeenCalledWith(response);
	});

	it("whenRedirectionResponse", async() => {
		const params = createParams();
		const response = createResponse(params, { code: "302" });
		vi.spyOn(PromiseRequest, "fetch").mockResolvedValue(E.right("response", response));

		const request = new PromiseRequest(params);
		const hook = vi.fn();
		const result = request.whenRedirectionResponse(hook);
		await request;

		expect(result).toBe(request);
		expect(hook).toHaveBeenCalledWith(response);
	});

	it("whenClientErrorResponse", async() => {
		const params = createParams();
		const response = createResponse(params, { code: "404" });
		vi.spyOn(PromiseRequest, "fetch").mockResolvedValue(E.right("response", response));

		const request = new PromiseRequest(params);
		const hook = vi.fn();
		const result = request.whenClientErrorResponse(hook);
		await request;

		expect(result).toBe(request);
		expect(hook).toHaveBeenCalledWith(response);
	});

	it("whenServerErrorResponse", async() => {
		const params = createParams();
		const response = createResponse(params, { code: "500" });
		vi.spyOn(PromiseRequest, "fetch").mockResolvedValue(E.right("response", response));

		const request = new PromiseRequest(params);
		const hook = vi.fn();
		const result = request.whenServerErrorResponse(hook);
		await request;

		expect(result).toBe(request);
		expect(hook).toHaveBeenCalledWith(response);
	});

	it("whenExpectedResponse", async() => {
		const params = createParams();
		const response = createResponse(params, { code: "404" });
		vi.spyOn(PromiseRequest, "fetch").mockResolvedValue(E.right("response", response));

		const request = new PromiseRequest(params);
		const hook = vi.fn();
		const result = request.whenExpectedResponse(hook);
		await request;

		expect(result).toBe(request);
		expect(hook).toHaveBeenCalledWith(response);
	});

	it("whenError", async() => {
		const params = createParams();
		const error = new Error("boom");
		vi.spyOn(PromiseRequest, "fetch").mockRejectedValue(error);

		const request = new PromiseRequest(params);
		const hook = vi.fn();
		const result = request.whenError(hook);
		const maybeResponse = await request;

		expect(result).toBe(request);
		expect(hook).toHaveBeenCalledWith(error, params);
		expect(E.isLeft(maybeResponse)).toBe(true);

		await expect(new PromiseRequest(params)).resolves.toStrictEqual(E.left("request-error", expect.objectContaining({})));
	});

	it("whenReceiveServerEvent", async() => {
		const spy = vi.fn();
		const params = createParams();
		const response = createResponse(params, {
			code: "200",
			headers: new Headers({ "content-type": "text/event-stream" }),
			onReceiveEvent: spy,
			[Symbol.asyncIterator]: async function *() {},
		});
		vi.spyOn(PromiseRequest, "fetch").mockResolvedValue(E.right("response", response));

		const request = new PromiseRequest(params);
		const result = request.whenReceiveServerEvent(
			"test",
			() => {},
		);
		await request;

		expect(result).toBe(request);
		expect(spy).toHaveBeenCalledWith("test", expect.any(Function));

		spy.mockClear();

		vi.spyOn(PromiseRequest, "fetch").mockResolvedValue(E.right("response", {
			...response,
			predicted: false,
		}));

		const requestNotPredicted = new PromiseRequest(params);
		const resultNotPredicated = requestNotPredicted.whenReceiveServerEvent(
			"test",
			() => {},
		);
		await requestNotPredicted;

		expect(resultNotPredicated).toBe(requestNotPredicted);
		expect(spy).toHaveBeenCalledTimes(0);
	});

	it("iWantInformation", async() => {
		const params = createParams();
		const response = createResponse(params, { information: "ready" });
		const fetchSpy = vi.spyOn(PromiseRequest, "fetch");
		fetchSpy.mockResolvedValueOnce(E.right("response", response));

		const request = new PromiseRequest(params);
		const match = await request.iWantInformation(["ready", "skip"]);

		expect(E.isRight(match)).toBe(true);
		expect(unwrap(match)).toBe(response);

		const paramsMiss = createParams();
		const responseMiss = createResponse(paramsMiss, { information: "other" });
		fetchSpy.mockResolvedValueOnce(E.right("response", responseMiss));

		const requestMiss = new PromiseRequest(paramsMiss);
		const miss = await requestMiss.iWantInformation("ready");

		expect(E.isLeft(miss)).toBe(true);
		expect(unwrap(miss)).toBe(responseMiss);

		const paramsNotPredicted = createParams();
		const responseNotPredicted = createResponse(paramsNotPredicted, {
			information: "ready",
			predicted: false,
		});
		fetchSpy.mockResolvedValueOnce(E.right("response", responseNotPredicted));

		const requestNotPredicted = new PromiseRequest(paramsNotPredicted);
		const notPredicted = await requestNotPredicted.iWantInformation("ready");

		expect(E.isLeft(notPredicted)).toBe(true);
		expect(unwrap(notPredicted)).toBe(responseNotPredicted);
	});

	it("iWantCode", async() => {
		const params = createParams();
		const response = createResponse(params, { code: "201" });
		const fetchSpy = vi.spyOn(PromiseRequest, "fetch");
		fetchSpy.mockResolvedValueOnce(E.right("response", response));

		const request = new PromiseRequest(params);
		const match = await request.iWantCode(["200", "201"]);

		expect(E.isRight(match)).toBe(true);
		expect(unwrap(match)).toBe(response);

		const paramsMiss = createParams();
		const responseMiss = createResponse(paramsMiss, { code: "404" });
		fetchSpy.mockResolvedValueOnce(E.right("response", responseMiss));

		const requestMiss = new PromiseRequest(paramsMiss);
		const miss = await requestMiss.iWantCode("200");

		expect(E.isLeft(miss)).toBe(true);
		expect(unwrap(miss)).toBe(responseMiss);

		const paramsNotPredicted = createParams();
		const responseNotPredicted = createResponse(paramsNotPredicted, {
			code: "200",
			predicted: false,
		});
		fetchSpy.mockResolvedValueOnce(E.right("response", responseNotPredicted));

		const requestNotPredicted = new PromiseRequest(paramsNotPredicted);
		const notPredicted = await requestNotPredicted.iWantCode("200");

		expect(E.isLeft(notPredicted)).toBe(true);
		expect(unwrap(notPredicted)).toBe(responseNotPredicted);
	});

	it("iWantInformationalResponse", async() => {
		const params = createParams();
		const response = createResponse(params, { code: "102" });
		const fetchSpy = vi.spyOn(PromiseRequest, "fetch");
		fetchSpy.mockResolvedValueOnce(E.right("response", response));

		const request = new PromiseRequest(params);
		const match = await request.iWantInformationalResponse();

		expect(E.isRight(match)).toBe(true);
		expect(unwrap(match)).toBe(response);

		const paramsMiss = createParams();
		const responseMiss = createResponse(paramsMiss, { code: "200" });
		fetchSpy.mockResolvedValueOnce(E.right("response", responseMiss));

		const requestMiss = new PromiseRequest(paramsMiss);
		const miss = await requestMiss.iWantInformationalResponse();

		expect(E.isLeft(miss)).toBe(true);
		expect(unwrap(miss)).toBe(responseMiss);

		const paramsNotPredicted = createParams();
		const responseNotPredicted = createResponse(paramsNotPredicted, {
			code: "102",
			predicted: false,
		});
		fetchSpy.mockResolvedValueOnce(E.right("response", responseNotPredicted));

		const requestNotPredicted = new PromiseRequest(paramsNotPredicted);
		const notPredicted = await requestNotPredicted.iWantInformationalResponse();

		expect(E.isLeft(notPredicted)).toBe(true);
		expect(unwrap(notPredicted)).toBe(responseNotPredicted);
	});

	it("iWantSuccessfulResponse", async() => {
		const params = createParams();
		const response = createResponse(params, { code: "200" });
		const fetchSpy = vi.spyOn(PromiseRequest, "fetch");
		fetchSpy.mockResolvedValueOnce(E.right("response", response));

		const request = new PromiseRequest(params);
		const match = await request.iWantSuccessfulResponse();

		expect(E.isRight(match)).toBe(true);
		expect(unwrap(match)).toBe(response);

		const paramsMiss = createParams();
		const responseMiss = createResponse(paramsMiss, { code: "302" });
		fetchSpy.mockResolvedValueOnce(E.right("response", responseMiss));

		const requestMiss = new PromiseRequest(paramsMiss);
		const miss = await requestMiss.iWantSuccessfulResponse();

		expect(E.isLeft(miss)).toBe(true);
		expect(unwrap(miss)).toBe(responseMiss);

		const paramsNotPredicted = createParams();
		const responseNotPredicted = createResponse(paramsNotPredicted, {
			code: "200",
			predicted: false,
		});
		fetchSpy.mockResolvedValueOnce(E.right("response", responseNotPredicted));

		const requestNotPredicted = new PromiseRequest(paramsNotPredicted);
		const notPredicted = await requestNotPredicted.iWantSuccessfulResponse();

		expect(E.isLeft(notPredicted)).toBe(true);
		expect(unwrap(notPredicted)).toBe(responseNotPredicted);
	});

	it("iWantRedirectionResponse", async() => {
		const params = createParams();
		const response = createResponse(params, { code: "302" });
		const fetchSpy = vi.spyOn(PromiseRequest, "fetch");
		fetchSpy.mockResolvedValueOnce(E.right("response", response));

		const request = new PromiseRequest(params);
		const match = await request.iWantRedirectionResponse();

		expect(E.isRight(match)).toBe(true);
		expect(unwrap(match)).toBe(response);

		const paramsMiss = createParams();
		const responseMiss = createResponse(paramsMiss, { code: "200" });
		fetchSpy.mockResolvedValueOnce(E.right("response", responseMiss));

		const requestMiss = new PromiseRequest(paramsMiss);
		const miss = await requestMiss.iWantRedirectionResponse();

		expect(E.isLeft(miss)).toBe(true);
		expect(unwrap(miss)).toBe(responseMiss);

		const paramsNotPredicted = createParams();
		const responseNotPredicted = createResponse(paramsNotPredicted, {
			code: "302",
			predicted: false,
		});
		fetchSpy.mockResolvedValueOnce(E.right("response", responseNotPredicted));

		const requestNotPredicted = new PromiseRequest(paramsNotPredicted);
		const notPredicted = await requestNotPredicted.iWantRedirectionResponse();

		expect(E.isLeft(notPredicted)).toBe(true);
		expect(unwrap(notPredicted)).toBe(responseNotPredicted);
	});

	it("iWantClientErrorResponse", async() => {
		const params = createParams();
		const response = createResponse(params, { code: "404" });
		const fetchSpy = vi.spyOn(PromiseRequest, "fetch");
		fetchSpy.mockResolvedValueOnce(E.right("response", response));

		const request = new PromiseRequest(params);
		const match = await request.iWantClientErrorResponse();

		expect(E.isRight(match)).toBe(true);
		expect(unwrap(match)).toBe(response);

		const paramsMiss = createParams();
		const responseMiss = createResponse(paramsMiss, { code: "500" });
		fetchSpy.mockResolvedValueOnce(E.right("response", responseMiss));

		const requestMiss = new PromiseRequest(paramsMiss);
		const miss = await requestMiss.iWantClientErrorResponse();

		expect(E.isLeft(miss)).toBe(true);
		expect(unwrap(miss)).toBe(responseMiss);

		const paramsNotPredicted = createParams();
		const responseNotPredicted = createResponse(paramsNotPredicted, {
			code: "404",
			predicted: false,
		});
		fetchSpy.mockResolvedValueOnce(E.right("response", responseNotPredicted));

		const requestNotPredicted = new PromiseRequest(paramsNotPredicted);
		const notPredicted = await requestNotPredicted.iWantClientErrorResponse();

		expect(E.isLeft(notPredicted)).toBe(true);
		expect(unwrap(notPredicted)).toBe(responseNotPredicted);
	});

	it("iWantServerErrorResponse", async() => {
		const params = createParams();
		const response = createResponse(params, { code: "500" });
		const fetchSpy = vi.spyOn(PromiseRequest, "fetch");
		fetchSpy.mockResolvedValueOnce(E.right("response", response));

		const request = new PromiseRequest(params);
		const match = await request.iWantServerErrorResponse();

		expect(E.isRight(match)).toBe(true);
		expect(unwrap(match)).toBe(response);

		const paramsMiss = createParams();
		const responseMiss = createResponse(paramsMiss, { code: "400" });
		fetchSpy.mockResolvedValueOnce(E.right("response", responseMiss));

		const requestMiss = new PromiseRequest(paramsMiss);
		const miss = await requestMiss.iWantServerErrorResponse();

		expect(E.isLeft(miss)).toBe(true);
		expect(unwrap(miss)).toBe(responseMiss);

		const paramsNotPredicted = createParams();
		const responseNotPredicted = createResponse(paramsNotPredicted, {
			code: "500",
			predicted: false,
		});
		fetchSpy.mockResolvedValueOnce(E.right("response", responseNotPredicted));

		const requestNotPredicted = new PromiseRequest(paramsNotPredicted);
		const notPredicted = await requestNotPredicted.iWantServerErrorResponse();

		expect(E.isLeft(notPredicted)).toBe(true);
		expect(unwrap(notPredicted)).toBe(responseNotPredicted);
	});

	it("iWantExpectedResponse", async() => {
		const params = createParams();
		const response = createResponse(params, { code: "204" });
		const fetchSpy = vi.spyOn(PromiseRequest, "fetch");
		fetchSpy.mockResolvedValueOnce(E.right("response", response));

		const request = new PromiseRequest(params);
		const match = await request.iWantExpectedResponse();

		expect(E.isRight(match)).toBe(true);
		expect(unwrap(match)).toBe(response);

		const paramsMiss = createParams();
		const responseMiss = createResponse(paramsMiss, { code: "302" });
		fetchSpy.mockResolvedValueOnce(E.right("response", responseMiss));

		const requestMiss = new PromiseRequest(paramsMiss);
		const miss = await requestMiss.iWantExpectedResponse();

		expect(E.isLeft(miss)).toBe(true);
		expect(unwrap(miss)).toBe(responseMiss);

		const paramsNotPredicted = createParams();
		const responseNotPredicted = createResponse(paramsNotPredicted, {
			code: "204",
			predicted: false,
		});
		fetchSpy.mockResolvedValueOnce(E.right("response", responseNotPredicted));

		const requestNotPredicted = new PromiseRequest(paramsNotPredicted);
		const notPredicted = await requestNotPredicted.iWantExpectedResponse();

		expect(E.isLeft(notPredicted)).toBe(true);
		expect(unwrap(notPredicted)).toBe(responseNotPredicted);
	});

	it("selectByInformation", async() => {
		const params = createParams();
		const response = createResponse(params, { information: "ready" });
		const fetchSpy = vi.spyOn(PromiseRequest, "fetch");
		fetchSpy.mockResolvedValueOnce(E.right("response", response));

		const request = new PromiseRequest(params);
		const match = await request.iSelectExpectedResponseByInformation({
			ready: true,
			other: false,
		});

		expect(E.isRight(match)).toBe(true);
		expect(unwrap(match)).toBe(response);

		const paramsMiss = createParams();
		const responseMiss = createResponse(paramsMiss, { information: undefined });
		fetchSpy.mockResolvedValueOnce(E.right("response", responseMiss));

		const requestMiss = new PromiseRequest(paramsMiss);
		const miss = await requestMiss.iSelectExpectedResponseByInformation({
			ready: true,
			other: false,
		});

		expect(E.isLeft(miss)).toBe(true);
		expect(unwrap(miss)).toBe(responseMiss);

		const paramsNotPredicted = createParams();
		const responseNotPredicted = createResponse(paramsNotPredicted, {
			information: "ready",
			predicted: false,
		});
		fetchSpy.mockResolvedValueOnce(E.right("response", responseNotPredicted));

		const requestNotPredicted = new PromiseRequest(paramsNotPredicted);
		const notPredicted = await requestNotPredicted.iSelectExpectedResponseByInformation({
			ready: true,
			other: false,
		});

		expect(E.isLeft(notPredicted)).toBe(true);
		expect(unwrap(notPredicted)).toBe(responseNotPredicted);
	});

	it("iWantInformationOrThrow", async() => {
		const params = createParams();
		const response = createResponse(params, { information: "ready" });
		const fetchSpy = vi.spyOn(PromiseRequest, "fetch");
		fetchSpy.mockResolvedValueOnce(E.right("response", response));

		const request = new PromiseRequest(params);
		await expect(request.iWantInformationOrThrow("ready")).resolves.toBe(response);

		const paramsMiss = createParams();
		const responseMiss = createResponse(paramsMiss, { information: "other" });
		fetchSpy.mockResolvedValueOnce(E.right("response", responseMiss));

		const requestMiss = new PromiseRequest(paramsMiss);
		await expect(requestMiss.iWantInformationOrThrow("ready")).rejects.toBeInstanceOf(
			UnexpectedInformationResponseError,
		);
	});

	it("iWantCodeOrThrow", async() => {
		const params = createParams();
		const response = createResponse(params, { code: "201" });
		const fetchSpy = vi.spyOn(PromiseRequest, "fetch");
		fetchSpy.mockResolvedValueOnce(E.right("response", response));

		const request = new PromiseRequest(params);
		await expect(request.iWantCodeOrThrow("201")).resolves.toBe(response);

		const paramsMiss = createParams();
		const responseMiss = createResponse(paramsMiss, { code: "404" });
		fetchSpy.mockResolvedValueOnce(E.right("response", responseMiss));

		const requestMiss = new PromiseRequest(paramsMiss);
		await expect(requestMiss.iWantCodeOrThrow("201")).rejects.toBeInstanceOf(
			UnexpectedCodeResponseError,
		);
	});

	it("iWantInformationalResponseOrThrow", async() => {
		const params = createParams();
		const response = createResponse(params, { code: "100" });
		const fetchSpy = vi.spyOn(PromiseRequest, "fetch");
		fetchSpy.mockResolvedValueOnce(E.right("response", response));

		const request = new PromiseRequest(params);
		await expect(request.iWantInformationalResponseOrThrow()).resolves.toBe(response);

		const paramsMiss = createParams();
		const responseMiss = createResponse(paramsMiss, { code: "200" });
		fetchSpy.mockResolvedValueOnce(E.right("response", responseMiss));

		const requestMiss = new PromiseRequest(paramsMiss);
		await expect(requestMiss.iWantInformationalResponseOrThrow()).rejects.toBeInstanceOf(
			UnexpectedResponseTypeError,
		);
	});

	it("iWantSuccessfulResponseOrThrow", async() => {
		const params = createParams();
		const response = createResponse(params, {
			code: "200",
		});
		const fetchSpy = vi.spyOn(PromiseRequest, "fetch");
		fetchSpy.mockResolvedValueOnce(E.right("response", response));

		const request = new PromiseRequest(params);
		await expect(request.iWantSuccessfulResponseOrThrow()).resolves.toBe(response);

		const paramsMiss = createParams();
		const responseMiss = createResponse(paramsMiss, { code: "300" });
		fetchSpy.mockResolvedValueOnce(E.right("response", responseMiss));

		const requestMiss = new PromiseRequest(paramsMiss);
		await expect(requestMiss.iWantSuccessfulResponseOrThrow()).rejects.toBeInstanceOf(
			UnexpectedResponseTypeError,
		);
	});

	it("iWantRedirectionResponseOrThrow", async() => {
		const params = createParams();
		const response = createResponse(params, { code: "301" });
		const fetchSpy = vi.spyOn(PromiseRequest, "fetch");
		fetchSpy.mockResolvedValueOnce(E.right("response", response));

		const request = new PromiseRequest(params);
		await expect(request.iWantRedirectionResponseOrThrow()).resolves.toBe(response);

		const paramsMiss = createParams();
		const responseMiss = createResponse(paramsMiss, { code: "200" });
		fetchSpy.mockResolvedValueOnce(E.right("response", responseMiss));

		const requestMiss = new PromiseRequest(paramsMiss);
		await expect(requestMiss.iWantRedirectionResponseOrThrow()).rejects.toBeInstanceOf(
			UnexpectedResponseTypeError,
		);
	});

	it("iWantClientErrorResponseOrThrow", async() => {
		const params = createParams();
		const response = createResponse(params, { code: "404" });
		const fetchSpy = vi.spyOn(PromiseRequest, "fetch");
		fetchSpy.mockResolvedValueOnce(E.right("response", response));

		const request = new PromiseRequest(params);
		await expect(request.iWantClientErrorResponseOrThrow()).resolves.toBe(response);

		const paramsMiss = createParams();
		const responseMiss = createResponse(paramsMiss, { code: "200" });
		fetchSpy.mockResolvedValueOnce(E.right("response", responseMiss));

		const requestMiss = new PromiseRequest(paramsMiss);
		await expect(requestMiss.iWantClientErrorResponseOrThrow()).rejects.toBeInstanceOf(
			UnexpectedResponseTypeError,
		);
	});

	it("iWantServerErrorResponseOrThrow", async() => {
		const params = createParams();
		const response = createResponse(params, { code: "500" });
		const fetchSpy = vi.spyOn(PromiseRequest, "fetch");
		fetchSpy.mockResolvedValueOnce(E.right("response", response));

		const request = new PromiseRequest(params);
		await expect(request.iWantServerErrorResponseOrThrow()).resolves.toBe(response);

		const paramsMiss = createParams();
		const responseMiss = createResponse(paramsMiss, { code: "400" });
		fetchSpy.mockResolvedValueOnce(E.right("response", responseMiss));

		const requestMiss = new PromiseRequest(paramsMiss);
		await expect(requestMiss.iWantServerErrorResponseOrThrow()).rejects.toBeInstanceOf(
			UnexpectedResponseTypeError,
		);
	});

	it("iWantExpectedResponseOrThrow", async() => {
		const params = createParams();
		const response = createResponse(params, { code: "204" });
		const fetchSpy = vi.spyOn(PromiseRequest, "fetch");
		fetchSpy.mockResolvedValueOnce(E.right("response", response));

		const request = new PromiseRequest(params);
		await expect(request.iWantExpectedResponseOrThrow()).resolves.toBe(response);

		const paramsMiss = createParams();
		const responseMiss = createResponse(paramsMiss, { code: "302" });
		fetchSpy.mockResolvedValueOnce(E.right("response", responseMiss));

		const requestMiss = new PromiseRequest(paramsMiss);
		await expect(requestMiss.iWantExpectedResponseOrThrow()).rejects.toBeInstanceOf(
			UnexpectedResponseError,
		);
	});

	it("selectByInformationOrThrow", async() => {
		const params = createParams();
		const response = createResponse(params, { information: "ready" });
		const fetchSpy = vi.spyOn(PromiseRequest, "fetch");
		fetchSpy.mockResolvedValueOnce(E.right("response", response));

		const request = new PromiseRequest(params);
		await expect(
			request.iSelectExpectedResponseByInformationOrThrow({
				ready: true,
				other: false,
			}),
		).resolves.toBe(response);

		const paramsMiss = createParams();
		const responseMiss = createResponse(paramsMiss, { information: "other" });
		fetchSpy.mockResolvedValueOnce(E.right("response", responseMiss));

		const requestMiss = new PromiseRequest(paramsMiss);
		await expect(
			requestMiss.iSelectExpectedResponseByInformationOrThrow({
				ready: true,
				other: false,
			}),
		).rejects.toBeInstanceOf(UnexpectedResponseError);
	});

	it("Symbol.species returns Promise", () => {
		vi.spyOn(PromiseRequest, "fetch").mockResolvedValue(
			E.right("response", createResponse(createParams())),
		);
		expect(PromiseRequest[Symbol.species]).toBe(Promise);
	});
});
