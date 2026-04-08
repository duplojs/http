import { type ClientResponse, type Hooks, type PromiseRequestParams, isClientStreamResponse, makeClientStreamResponse } from "@client";
import { A } from "@duplojs/utils";

describe("stream", () => {
	const encoder = new TextEncoder();

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

	const createRequestParams = (
		overrides: Partial<PromiseRequestParams> = {},
	): PromiseRequestParams => ({
		baseUrl: "http://test.local",
		method: "GET",
		path: "/stream",
		headers: {},
		hooks: createHooks(),
		informationHeaderKey: "information",
		predictedHeaderKey: "predicted",
		disabledPredicateMode: false,
		abortController: new AbortController(),
		cacheStore: new Map(),
		...overrides,
	});

	const createRawStreamResponse = (
		chunks: Uint8Array[],
		headers: HeadersInit = { "content-type": "application/octet-stream" },
	): Response => new Response(
		new ReadableStream<Uint8Array>({
			start(controller) {
				for (const chunk of chunks) {
					controller.enqueue(chunk);
				}
				controller.close();
			},
		}),
		{
			status: 200,
			headers,
		},
	);

	const createResponse = (
		overrides: Partial<ClientResponse> = {},
	): ClientResponse => {
		const requestParams = overrides.requestParams ?? createRequestParams();

		return {
			code: "200",
			information: undefined,
			body: undefined,
			ok: true,
			headers: new Headers({ "content-type": "application/octet-stream" }),
			type: "basic",
			url: `${requestParams.baseUrl}${requestParams.path}`,
			redirected: false,
			raw: createRawStreamResponse([]),
			requestParams,
			predicted: true,
			...overrides,
		};
	};

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("returns empty stream when body reader is missing and runs start/close hooks", async() => {
		const startGlobal = vi.fn();
		const closeGlobal = vi.fn();
		const startLocal = vi.fn();
		const closeLocal = vi.fn();

		const response = makeClientStreamResponse(
			createResponse({
				raw: {} as Response,
				requestParams: createRequestParams({
					hooks: {
						...createHooks(),
						startStream: [startGlobal],
						closeStream: [closeGlobal],
					},
				}),
			}),
		)
			.onStream("start", startLocal)
			.onStream("close", closeLocal);

		await expect(A.from(response)).resolves.toStrictEqual([]);
		expect(startGlobal).toHaveBeenCalledTimes(1);
		expect(closeGlobal).toHaveBeenCalledTimes(1);
		expect(startLocal).toHaveBeenCalledTimes(1);
		expect(closeLocal).toHaveBeenCalledTimes(1);
	});

	it("ignores unknown stream event name at runtime", async() => {
		const callback = vi.fn();
		const response = makeClientStreamResponse(
			createResponse({
				raw: {} as Response,
			}),
		);

		const chain = response.onStream("unknown-event" as never, callback as never);

		expect(chain).toBe(response);
		await expect(A.from(response)).resolves.toStrictEqual([]);
		expect(callback).toHaveBeenCalledTimes(0);
	});

	it("returns empty stream when response code is 204", async() => {
		const response = makeClientStreamResponse(
			createResponse({
				code: "204",
				raw: createRawStreamResponse([encoder.encode("hello")]),
			}),
		);

		await expect(A.from(response)).resolves.toStrictEqual([]);
	});

	it("reads binary stream and executes receive hooks", async() => {
		const startGlobal = vi.fn();
		const receiveGlobal = vi.fn();
		const closeGlobal = vi.fn();
		const errorGlobal = vi.fn();
		const startLocal = vi.fn();
		const receiveLocal = vi.fn();
		const closeLocal = vi.fn();
		const errorLocal = vi.fn();
		const firstChunk = Uint8Array.from([1, 2]);
		const secondChunk = Uint8Array.from([3, 4]);

		const response = makeClientStreamResponse(
			createResponse({
				raw: createRawStreamResponse([firstChunk, secondChunk]),
				requestParams: createRequestParams({
					hooks: {
						...createHooks(),
						startStream: [startGlobal],
						receiveDataStream: [receiveGlobal],
						closeStream: [closeGlobal],
						errorStream: [errorGlobal],
					},
				}),
			}),
		)
			.onStream("start", startLocal)
			.onStream("receiveData", receiveLocal)
			.onStream("close", closeLocal)
			.onStream("error", errorLocal);

		const chunks = await A.from(response);

		expect(chunks).toStrictEqual([firstChunk, secondChunk]);
		expect(startGlobal).toHaveBeenCalledTimes(1);
		expect(startLocal).toHaveBeenCalledTimes(1);
		expect(receiveGlobal).toHaveBeenCalledTimes(2);
		expect(receiveLocal).toHaveBeenCalledTimes(2);
		expect(receiveLocal).toHaveBeenNthCalledWith(1, firstChunk, response);
		expect(receiveLocal).toHaveBeenNthCalledWith(2, secondChunk, response);
		expect(closeGlobal).toHaveBeenCalledTimes(1);
		expect(closeLocal).toHaveBeenCalledTimes(1);
		expect(errorGlobal).toHaveBeenCalledTimes(0);
		expect(errorLocal).toHaveBeenCalledTimes(0);
	});

	it("consumeStream drains stream and triggers hooks", async() => {
		const receiveGlobal = vi.fn();
		const closeGlobal = vi.fn();
		const receiveLocal = vi.fn();
		const closeLocal = vi.fn();
		const firstChunk = Uint8Array.from([1, 2]);
		const secondChunk = Uint8Array.from([3, 4]);

		const response = makeClientStreamResponse(
			createResponse({
				raw: createRawStreamResponse([firstChunk, secondChunk]),
				requestParams: createRequestParams({
					hooks: {
						...createHooks(),
						receiveDataStream: [receiveGlobal],
						closeStream: [closeGlobal],
					},
				}),
			}),
		)
			.onStream("receiveData", receiveLocal)
			.onStream("close", closeLocal);

		await expect(response.consumeStream()).resolves.toBeUndefined();

		expect(receiveGlobal).toHaveBeenCalledTimes(2);
		expect(receiveLocal).toHaveBeenCalledTimes(2);
		expect(receiveLocal).toHaveBeenNthCalledWith(1, firstChunk, response);
		expect(receiveLocal).toHaveBeenNthCalledWith(2, secondChunk, response);
		expect(closeGlobal).toHaveBeenCalledTimes(1);
		expect(closeLocal).toHaveBeenCalledTimes(1);
	});

	it("reads text stream and flushes final decoder state", async() => {
		const response = makeClientStreamResponse(
			createResponse({
				headers: new Headers({ "content-type": "text/plain; charset=utf-8" }),
				raw: createRawStreamResponse(
					[encoder.encode("hel"), encoder.encode("lo")],
					{ "content-type": "text/plain; charset=utf-8" },
				),
			}),
		);

		await expect(A.from(response)).resolves.toStrictEqual(["hel", "lo"]);
	});

	it("returns empty array for empty text stream", async() => {
		const response = makeClientStreamResponse(
			createResponse({
				headers: new Headers({ "content-type": "text/plain; charset=utf-8" }),
				raw: createRawStreamResponse(
					[],
					{ "content-type": "text/plain; charset=utf-8" },
				),
			}),
		);

		await expect(A.from(response)).resolves.toStrictEqual([]);
	});

	it("returns final text chunk when reader ends with value", async() => {
		const response = makeClientStreamResponse(
			createResponse({
				headers: new Headers({ "content-type": "text/plain; charset=utf-8" }),
				raw: {
					body: {
						getReader: () => ({
							read: vi.fn().mockResolvedValue({
								done: true,
								value: encoder.encode("hello"),
							}),
						}),
					},
				} as never,
			}),
		);

		await expect(A.from(response)).resolves.toStrictEqual(["hello"]);
	});

	it("skips empty intermediate text chunk before stream end", async() => {
		const response = makeClientStreamResponse(
			createResponse({
				headers: new Headers({ "content-type": "text/plain; charset=utf-8" }),
				raw: {
					body: {
						getReader: () => ({
							read: vi.fn()
								.mockResolvedValueOnce({
									done: false,
									value: new Uint8Array([]),
								})
								.mockResolvedValueOnce({
									done: true,
									value: undefined,
								}),
						}),
					},
				} as never,
			}),
		);

		await expect(A.from(response)).resolves.toStrictEqual([]);
	});

	it("emits error hook when reader throws and still closes stream", async() => {
		const closeGlobal = vi.fn();
		const errorGlobal = vi.fn();
		const closeLocal = vi.fn();
		const errorLocal = vi.fn();
		const boom = new Error("boom");

		const response = makeClientStreamResponse(
			createResponse({
				raw: {
					body: {
						getReader: () => ({
							read: vi.fn().mockRejectedValue(boom),
						}),
					},
				} as never,
				requestParams: createRequestParams({
					hooks: {
						...createHooks(),
						closeStream: [closeGlobal],
						errorStream: [errorGlobal],
					},
				}),
			}),
		)
			.onStream("close", closeLocal)
			.onStream("error", errorLocal);

		await expect(A.from(response)).resolves.toStrictEqual([]);
		expect(errorGlobal).toHaveBeenCalledTimes(1);
		expect(errorGlobal).toHaveBeenCalledWith(boom, response);
		expect(errorLocal).toHaveBeenCalledTimes(1);
		expect(errorLocal).toHaveBeenCalledWith(boom, response);
		expect(closeGlobal).toHaveBeenCalledTimes(1);
		expect(closeLocal).toHaveBeenCalledTimes(1);
	});

	it("emits global error hook without local error listeners", async() => {
		const errorGlobal = vi.fn();

		const response = makeClientStreamResponse(
			createResponse({
				raw: {
					body: {
						getReader: () => ({
							read: vi.fn().mockRejectedValue(new Error("boom")),
						}),
					},
				} as never,
				requestParams: createRequestParams({
					hooks: {
						...createHooks(),
						errorStream: [errorGlobal],
					},
				}),
			}),
		);

		await expect(A.from(response)).resolves.toStrictEqual([]);
		expect(errorGlobal).toHaveBeenCalledTimes(1);
	});

	it("closeStream aborts iteration before reading", async() => {
		const response = makeClientStreamResponse(
			createResponse({
				raw: {
					body: {
						getReader: () => ({
							read: vi.fn(),
						}),
					},
				} as never,
			}),
		);

		response.closeStream();

		await expect(A.from(response)).resolves.toStrictEqual([]);
	});

	it("closeStream during read exits without emitting error hook", async() => {
		const errorGlobal = vi.fn();
		const requestParams = createRequestParams({
			hooks: {
				...createHooks(),
				errorStream: [errorGlobal],
			},
		});
		const streamResponse = makeClientStreamResponse(
			createResponse({
				requestParams,
				raw: {
					body: {
						getReader: () => ({
							read: vi.fn().mockImplementation(() => {
								streamResponse.closeStream();
								return Promise.reject(requestParams.abortController.signal.reason as Error);
							}),
						}),
					},
				} as never,
			}),
		);

		await expect(A.from(streamResponse)).resolves.toStrictEqual([]);
		expect(errorGlobal).toHaveBeenCalledTimes(0);
	});

	it("isClientStreamResponse detects stream responses", () => {
		const streamResponse = makeClientStreamResponse(createResponse());
		const plainResponse = createResponse();

		expect(isClientStreamResponse(streamResponse)).toBe(true);
		expect(isClientStreamResponse(plainResponse)).toBe(false);
	});
});
