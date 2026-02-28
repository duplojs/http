import { type Hooks, type PromiseRequestParams } from "@client";
import { PromiseRequest } from "@client/promiseRequest";
import { type ClientResponse } from "@client/types/clientResponse";
import { UnexpectedCodeResponseError, UnexpectedInformationResponseError, UnexpectedResponseError, UnexpectedResponseTypeError } from "@client/unexpectedResponseError";
import { asserts, unwrap, E, createFormData } from "@duplojs/utils";

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
	});

	const createParams = (overrides: Partial<PromiseRequestParams> = {}) => ({
		baseUrl: "http://test.local",
		method: "GET",
		path: "/resource",
		headers: {},
		hooks: createHooks(),
		informationHeaderKey: "information",
		predictedHeaderKey: "predicted",
		disabledPredicateMode: false,
		...overrides,
	});

	const createResponse = (
		params: PromiseRequestParams,
		overrides: Partial<ClientResponse> = {},
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

		const fetchMock = vi.fn()
			.mockResolvedValueOnce(jsonResponse)
			.mockResolvedValueOnce(jsonResponse)
			.mockResolvedValueOnce(jsonResponse)
			.mockResolvedValueOnce(errorResponse)
			.mockResolvedValueOnce(jsonResponse)
			.mockResolvedValueOnce(jsonResponse)
			.mockResolvedValueOnce(jsonResponse)
			.mockResolvedValueOnce(jsonResponse)
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
		asserts(resultError, E.isLeft);

		expect(unwrap(result).body).toStrictEqual({ value: 1 });
		expect(unwrap(result).information).toBe("info");
		expect(unwrap(result).predicted).toBe(true);
		expect(unwrap(resultObject).ok).toBe(true);
		expect(unwrap(resultBoolean).ok).toBe(true);
		expect(unwrap(resultNumber).ok).toBeNull();
		expect(unwrap(resultNumber).predicted).toBe(false);
		expect(unwrap(resultHeader).ok).toBe(true);
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
			predicted: false,
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
