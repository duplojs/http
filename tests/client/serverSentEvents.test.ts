import { type ClientResponse, type Hooks, type PromiseRequestParams, makeClientEventsResponse } from "@client";
import { A, pipe, S, sleep } from "@duplojs/utils";

describe("server sent event", () => {
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
		path: "/sse",
		headers: {},
		hooks: createHooks(),
		informationHeaderKey: "information",
		predictedHeaderKey: "predicted",
		disabledPredicateMode: false,
		abortController: new AbortController(),
		cacheStore: new Map(),
		...overrides,
	});

	const createRawSseResponse = (
		chunks: string[],
		options: {
			status?: number;
			headers?: HeadersInit;
		} = {},
	): Response => new Response(
		new ReadableStream<Uint8Array>({
			start(controller) {
				for (const chunk of chunks) {
					controller.enqueue(encoder.encode(chunk));
				}
				controller.close();
			},
		}),
		{
			status: options.status ?? 200,
			headers: options.headers ?? { "content-type": "text/event-stream" },
		},
	);

	const createResponse = (
		overrides: Partial<ClientResponse> = {},
	): ClientResponse => {
		const requestParams = overrides.requestParams ?? createRequestParams();
		return {
			code: "200",
			information: undefined,
			body: { ok: true },
			ok: true,
			headers: new Headers({ "content-type": "text/event-stream" }),
			type: "basic",
			url: `${requestParams.baseUrl}${requestParams.path}`,
			redirected: false,
			raw: createRawSseResponse([]),
			requestParams,
			predicted: true,
			...overrides,
		};
	};

	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	});

	it("returns empty stream when body reader is missing and runs start/close hooks", async() => {
		const startGlobal = vi.fn();
		const closeGlobal = vi.fn();
		const startLocal = vi.fn();
		const closeLocal = vi.fn();
		const response = makeClientEventsResponse(
			createResponse({
				headers: new Headers(),
				raw: {} as Response,
				requestParams: createRequestParams({
					hooks: {
						...createHooks(),
						startServerEvent: [startGlobal],
						closeServerEvent: [closeGlobal],
					},
				}),
			}),
			"http://test.local/sse",
			{},
		)
			.onStreamEvent("start", startLocal)
			.onStreamEvent("close", closeLocal);

		await expect(A.from(response)).resolves.toStrictEqual([]);
		expect(startGlobal).toHaveBeenCalledTimes(1);
		expect(closeGlobal).toHaveBeenCalledTimes(1);
		expect(startLocal).toHaveBeenCalledTimes(1);
		expect(closeLocal).toHaveBeenCalledTimes(1);
	});

	it("ignores unknown stream event name at runtime", async() => {
		const callback = vi.fn();
		const response = makeClientEventsResponse(
			createResponse({
				headers: new Headers(),
				raw: {} as Response,
			}),
			"http://test.local/sse",
			{},
		);

		const chain = response.onStreamEvent("unknown-event" as never, callback as never);
		expect(chain).toBe(response);
		await expect(A.from(response)).resolves.toStrictEqual([]);
		expect(callback).toHaveBeenCalledTimes(0);
	});

	it("returns empty stream when response code is 204", async() => {
		const response = makeClientEventsResponse(
			createResponse({
				code: "204",
				raw: createRawSseResponse(["data: hello\n\n"]),
			}),
			"http://test.local/sse",
			{},
		);

		await expect(A.from(response)).resolves.toStrictEqual([]);
	});

	it("parses SSE payload and executes receive hooks", async() => {
		const startGlobal = vi.fn();
		const receiveGlobal = vi.fn();
		const beforeRetryGlobal = vi.fn();
		const closeGlobal = vi.fn();
		const errorGlobal = vi.fn();
		const startLocal = vi.fn();
		const receiveLocal = vi.fn();
		const receiveByName = vi.fn();
		const receiveByWrongName = vi.fn();
		const beforeRetryLocal = vi.fn();
		const closeLocal = vi.fn();
		const errorLocal = vi.fn();
		const fetchMock = vi.fn().mockResolvedValue(
			new Response(null, { status: 204 }),
		);
		vi.stubGlobal("fetch", fetchMock);

		const payload = pipe(
			<string>"event: ping\ndata: hello\nid: id-1\nretry: 12\n\ndata: line1\ndata: line2\n\nevent: json\r\ncontent-type: application/json\r\ndata: {\"ok\":true}\r\n\r\nid: bad\0id\nretry: abc\ndata: plain\n\nevent: skip\nid: skip-id\n\n",
			S.split(""),
		);
		const response = makeClientEventsResponse(
			createResponse({
				raw: createRawSseResponse(payload),
				requestParams: createRequestParams({
					hooks: {
						...createHooks(),
						startServerEvent: [startGlobal],
						receiveEventServerEvent: [receiveGlobal],
						beforeRetryServerEvent: [beforeRetryGlobal],
						closeServerEvent: [closeGlobal],
						errorServerEvent: [errorGlobal],
					},
				}),
			}),
			"http://test.local/sse",
			{},
		)
			.onStreamEvent("start", startLocal)
			.onStreamEvent("receiveServerEvents", receiveLocal)
			.onReceiveEvent("ping", receiveByName)
			.onReceiveEvent("missing-event", receiveByWrongName)
			.onStreamEvent("beforeRetry", beforeRetryLocal)
			.onStreamEvent("close", closeLocal)
			.onStreamEvent("error", errorLocal);

		const events = await A.from(response);

		expect(events).toStrictEqual([
			{
				event: "ping",
				data: "hello",
				id: "id-1",
				retry: 12,
			},
			{
				event: "message",
				data: "line1\nline2",
				id: undefined,
				retry: undefined,
			},
			{
				event: "json",
				data: { ok: true },
				id: undefined,
				retry: undefined,
			},
			{
				event: "message",
				data: "plain",
				id: undefined,
				retry: undefined,
			},
		]);

		expect(startGlobal).toHaveBeenCalledTimes(1);
		expect(startLocal).toHaveBeenCalledTimes(1);
		expect(receiveGlobal).toHaveBeenCalledTimes(4);
		expect(receiveLocal).toHaveBeenCalledTimes(4);
		expect(receiveByName).toHaveBeenCalledTimes(1);
		expect(receiveByName).toHaveBeenCalledWith(events[0], response);
		expect(receiveByWrongName).toHaveBeenCalledTimes(0);
		expect(beforeRetryGlobal).toHaveBeenCalledTimes(1);
		expect(beforeRetryLocal).toHaveBeenCalledTimes(1);
		expect(errorGlobal).toHaveBeenCalledTimes(0);
		expect(errorLocal).toHaveBeenCalledTimes(0);
		expect(closeGlobal).toHaveBeenCalledTimes(1);
		expect(closeLocal).toHaveBeenCalledTimes(1);
	});

	it("retries by fetching a new SSE stream and forwards last-event-id", async() => {
		const beforeRetryGlobal = vi.fn();
		const beforeRetryLocal = vi.fn();
		const fetchMock = vi.fn()
			.mockResolvedValueOnce(
				createRawSseResponse(
					["id: second\ndata: second-data\n\n"],
					{ headers: { "content-type": "text/event-stream" } },
				),
			)
			.mockResolvedValueOnce(
				new Response(null, { status: 204 }),
			);
		vi.stubGlobal("fetch", fetchMock);

		const response = makeClientEventsResponse(
			createResponse({
				raw: createRawSseResponse(["id: first\ndata: first-data\nretry: 0\n\ndata: dropped-data"]),
				requestParams: createRequestParams({
					headers: { authorization: "Bearer initial" },
					hooks: {
						...createHooks(),
						beforeRetryServerEvent: [beforeRetryGlobal],
					},
				}),
			}),
			"http://test.local/sse",
			{
				headers: { "x-client": "1" },
			},
		).onStreamEvent("beforeRetry", beforeRetryLocal);

		const events = await A.from(response);

		expect(events).toStrictEqual([
			{
				event: "message",
				data: "first-data",
				id: "first",
				retry: 0,
			},
			{
				event: "message",
				data: "second-data",
				id: "second",
				retry: undefined,
			},
		]);

		expect(beforeRetryGlobal).toHaveBeenCalledTimes(2);
		expect(beforeRetryLocal).toHaveBeenCalledTimes(2);
		expect(fetchMock).toHaveBeenCalledTimes(2);
		expect(fetchMock).toHaveBeenNthCalledWith(
			1,
			"http://test.local/sse",
			expect.objectContaining({
				headers: {
					"x-client": "1",
					"last-event-id": "first",
				},
				signal: expect.any(AbortSignal),
			}),
		);
		expect(fetchMock).toHaveBeenNthCalledWith(
			2,
			"http://test.local/sse",
			expect.objectContaining({
				headers: {
					"x-client": "1",
					"last-event-id": "second",
				},
				signal: expect.any(AbortSignal),
			}),
		);
	});

	it("stops retry when fetched stream metadata does not match", async() => {
		const beforeRetryGlobal = vi.fn();
		const fetchMock = vi.fn()
			.mockResolvedValueOnce(
				createRawSseResponse(
					["data: ignored\n\n"],
					{
						headers: {
							"content-type": "text/event-stream",
							information: "other-information",
						},
					},
				),
			)
			.mockResolvedValue(
				new Response(null, { status: 204 }),
			);
		vi.stubGlobal("fetch", fetchMock);

		const response = makeClientEventsResponse(
			createResponse({
				information: "expected-information",
				raw: createRawSseResponse(["data: first\n\n"]),
				requestParams: createRequestParams({
					hooks: {
						...createHooks(),
						beforeRetryServerEvent: [beforeRetryGlobal],
					},
				}),
			}),
			"http://test.local/sse",
			{},
		);

		await expect(A.from(response)).resolves.toStrictEqual([
			{
				event: "message",
				data: "first",
				id: undefined,
				retry: undefined,
			},
		]);
		expect(beforeRetryGlobal).toHaveBeenCalledTimes(1);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it("emits error hook when reader fails and then retries", async() => {
		const readError = new Error("boom-read");
		const beforeRetryGlobal = vi.fn();
		const beforeRetryLocal = vi.fn();
		const errorGlobal = vi.fn();
		const errorLocal = vi.fn();
		const reader = {
			read: vi.fn().mockRejectedValueOnce(readError),
		};
		const fetchMock = vi.fn().mockResolvedValueOnce(
			new Response(null, { status: 204 }),
		);
		vi.stubGlobal("fetch", fetchMock);

		const response = makeClientEventsResponse(
			createResponse({
				raw: {
					body: {
						getReader: () => reader,
					},
				} as unknown as Response,
				requestParams: createRequestParams({
					hooks: {
						...createHooks(),
						beforeRetryServerEvent: [beforeRetryGlobal],
						errorServerEvent: [errorGlobal],
					},
				}),
			}),
			"http://test.local/sse",
			{},
		)
			.onStreamEvent("beforeRetry", beforeRetryLocal)
			.onStreamEvent("error", errorLocal);

		await expect(A.from(response)).resolves.toStrictEqual([]);
		expect(reader.read).toHaveBeenCalledTimes(1);
		expect(errorGlobal).toHaveBeenCalledTimes(1);
		expect(errorLocal).toHaveBeenCalledTimes(1);
		expect(errorGlobal).toHaveBeenCalledWith(readError, response);
		expect(errorLocal).toHaveBeenCalledWith(readError, response);
		expect(beforeRetryGlobal).toHaveBeenCalledTimes(1);
		expect(beforeRetryLocal).toHaveBeenCalledTimes(1);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it("closeEventStream aborts retry loop without emitting error", async() => {
		const beforeRetryLocal = vi.fn((eventResponse: ReturnType<typeof makeClientEventsResponse>) => {
			eventResponse.closeEventStream();
		});
		const errorLocal = vi.fn();
		const fetchMock = vi.fn(async(url: string, init?: RequestInit) => {
			if (init?.signal?.aborted) {
				throw await init.signal.reason;
			}
			return new Response(null, { status: 204 });
		});
		vi.stubGlobal("fetch", fetchMock);

		const response = makeClientEventsResponse(
			createResponse({
				raw: createRawSseResponse([]),
			}),
			"http://test.local/sse",
			{},
		)
			.onStreamEvent("beforeRetry", beforeRetryLocal)
			.onStreamEvent("error", errorLocal);

		await expect(A.from(response)).resolves.toStrictEqual([]);
		expect(beforeRetryLocal).toHaveBeenCalledTimes(1);
		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(errorLocal).toHaveBeenCalledTimes(0);
	});

	it("emits error hook when event payload json is invalid", async() => {
		const fetchMock = vi.fn().mockResolvedValueOnce(
			new Response(null, { status: 204 }),
		);
		vi.stubGlobal("fetch", fetchMock);

		const errorLocal = vi.fn();
		const secondErrorLocal = vi.fn();
		const closeLocal = vi.fn();
		const response = makeClientEventsResponse(
			createResponse({
				raw: createRawSseResponse(["event: broken\ncontent-type: application/json\ndata: {bad-json}\n\n"]),
			}),
			"http://test.local/sse",
			{},
		)
			.onStreamEvent("error", errorLocal)
			.onStreamEvent("error", secondErrorLocal)
			.onStreamEvent("close", closeLocal)
			.consumeEventStream();

		await sleep(3100);

		expect(errorLocal).toHaveBeenCalledTimes(1);
		expect(secondErrorLocal).toHaveBeenCalledTimes(1);
		expect(errorLocal.mock.calls[0]?.[0]).toBeInstanceOf(SyntaxError);
		expect(closeLocal).toHaveBeenCalledTimes(1);
	});

	it("emits global error hook when local error listener is missing", async() => {
		const fetchMock = vi.fn().mockResolvedValueOnce(
			new Response(null, { status: 204 }),
		);
		vi.stubGlobal("fetch", fetchMock);

		const errorGlobal = vi.fn();
		const response = makeClientEventsResponse(
			createResponse({
				raw: createRawSseResponse(["content-type: application/json\ndata: {broken}\n\n"]),
				requestParams: createRequestParams({
					hooks: {
						...createHooks(),
						errorServerEvent: [errorGlobal],
					},
				}),
			}),
			"http://test.local/sse",
			{},
		).consumeEventStream();

		await sleep(100);

		expect(errorGlobal).toHaveBeenCalledTimes(1);
		expect(errorGlobal.mock.calls[0]?.[0]).toBeInstanceOf(SyntaxError);
	});
});
