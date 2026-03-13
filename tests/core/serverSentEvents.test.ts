import { ServerSentEvents, ServerSentEventsPredictedResponse } from "@core";

describe("ServerSentEvents", () => {
	const spySend = vi.fn();
	const spyClose = vi.fn();
	const spyOnClose = vi.fn();
	const spyOnAbort = vi.fn();
	const spyOnError = vi.fn();

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("start abort ServerSentEvents", async() => {
		const spySending = vi.fn();

		const handler = ServerSentEvents.init(
			new ServerSentEventsPredictedResponse(
				"200",
				"test",
				spySending,
			),
			{
				lastId: null,
			},
		);

		handler.abort();
		await handler.start(spySend, spyClose);

		expect(spyClose).toHaveBeenCalledTimes(0);
		expect(spySend).toHaveBeenCalledTimes(0);
		expect(spySending).toHaveBeenCalledTimes(0);
	});

	it("start ServerSentEvents send event and that's it", async() => {
		const handler = ServerSentEvents.init(
			new ServerSentEventsPredictedResponse(
				"200",
				"test",
				async({ send, onClose, onAbort }) => {
					onClose(spyOnClose);
					onAbort(spyOnAbort);

					await send("superMessage", "test1");
					await send("superMessage", "test2");
					await send("superMessage", "test3");
				},
			),
			{
				lastId: null,
			},
		);

		await handler.start(spySend, spyClose);

		expect(spyOnClose).toHaveBeenCalledTimes(1);
		expect(spyOnAbort).toHaveBeenCalledTimes(0);
		expect(spyOnError).toHaveBeenCalledTimes(0);
		expect(spyClose).toHaveBeenCalledTimes(1);
		expect(spySend).toHaveBeenCalledTimes(3);
		expect(spySend).toHaveBeenNthCalledWith(
			1,
			"event: superMessage\ndata: test1\n\n",
		);
		expect(spySend).toHaveBeenNthCalledWith(
			2,
			"event: superMessage\ndata: test2\n\n",
		);
		expect(spySend).toHaveBeenNthCalledWith(
			3,
			"event: superMessage\ndata: test3\n\n",
		);
	});

	it("start ServerSentEvents send event and force close", async() => {
		const handler = ServerSentEvents.init(
			new ServerSentEventsPredictedResponse(
				"200",
				"test",
				async({ send, close, onClose, onAbort, isClose, isAbort }) => {
					onClose(spyOnClose);
					onAbort(spyOnAbort);

					expect(isAbort()).toBe(false);
					expect(isClose()).toBe(false);

					await send("superMessage2", "test1");
					close();
					await send("superMessage2", "test2");

					expect(isAbort()).toBe(false);
					expect(isClose()).toBe(true);
				},
			),
			{
				lastId: null,
			},
		);

		await handler.start(spySend, spyClose);

		expect(spyOnClose).toHaveBeenCalledTimes(1);
		expect(spyOnAbort).toHaveBeenCalledTimes(0);
		expect(spyOnError).toHaveBeenCalledTimes(0);
		expect(spySend).toHaveBeenCalledTimes(1);
		expect(spySend).toHaveBeenNthCalledWith(
			1,
			"event: superMessage2\ndata: test1\n\n",
		);
	});

	it("start ServerSentEvents send event and abort", async() => {
		const spySend = vi.fn();
		const spyClose = vi.fn();

		const handler = ServerSentEvents.init(
			new ServerSentEventsPredictedResponse(
				"200",
				"test",
				async({ send, abort, onClose, onAbort, isClose, isAbort }) => {
					onClose(spyOnClose);
					onAbort(spyOnAbort);

					expect(isAbort()).toBe(false);
					expect(isClose()).toBe(false);

					await send("superMessage1", "test1");
					abort();
					await send("superMessage1", "test2");

					expect(isAbort()).toBe(true);
					expect(isClose()).toBe(false);
				},
			),
			{
				lastId: null,
			},
		);

		await handler.start(spySend, spyClose);

		handler.abort();

		expect(spyOnClose).toHaveBeenCalledTimes(1);
		expect(spyOnAbort).toHaveBeenCalledTimes(1);
		expect(spyOnError).toHaveBeenCalledTimes(0);
		expect(spyClose).toHaveBeenCalledTimes(1);
		expect(spySend).toHaveBeenCalledTimes(1);
		expect(spySend).toHaveBeenNthCalledWith(
			1,
			"event: superMessage1\ndata: test1\n\n",
		);
	});

	it("start ServerSentEvents send event and force close", async() => {
		const handler = ServerSentEvents.init(
			new ServerSentEventsPredictedResponse(
				"200",
				"test",
				({ onClose, onAbort, onError }) => {
					onClose(spyOnClose);
					onAbort(spyOnAbort);
					onError(spyOnError);

					throw new Error("boom");
				},
			),
			{
				lastId: null,
			},
		);

		await handler.start(spySend, spyClose);

		expect(spyOnClose).toHaveBeenCalledTimes(1);
		expect(spyOnAbort).toHaveBeenCalledTimes(0);
		expect(spyOnError).toHaveBeenCalledWith(
			new Error("boom"),
		);
	});

	it("start ServerSentEvents send event with parameter", async() => {
		const handler = ServerSentEvents.init(
			new ServerSentEventsPredictedResponse(
				"200",
				"test",
				async({ send, onClose, onAbort, lastId }) => {
					expect(lastId).toBe("test");
					onClose(spyOnClose);
					onAbort(spyOnAbort);

					await send("", "test1");
					await send("superMessage4", { super: "object" });
					await send("superMessage4", undefined);
					await send("superMessage4", "ok", { id: "tets" });
					await send("superMessage4", "ok1", { id: "ff\0" });
					await send("superMessage4", "ok2", { id: "\n" });
					await send("superMessage4", "ok3", { id: "\rokok" });
					await send("superMessage4", "ok4", { retry: "20h" });
					await send("superMessage4", { super: "object" }, {
						id: "10",
						retry: 20,
					});
				},
			),
			{
				lastId: "test",
			},
		);

		await handler.start(spySend, spyClose);

		expect(spyOnAbort).toHaveBeenCalledTimes(0);
		expect(spyOnError).toHaveBeenCalledTimes(0);
		expect(spyClose).toHaveBeenCalledTimes(1);
		expect(spySend).toHaveBeenCalledTimes(9);
		expect(spySend).toHaveBeenNthCalledWith(
			1,
			"event: message\ndata: test1\n\n",
		);
		expect(spySend).toHaveBeenNthCalledWith(
			2,
			"event: superMessage4\ncontent-type: application/json\ndata: {\"super\":\"object\"}\n\n",
		);
		expect(spySend).toHaveBeenNthCalledWith(
			3,
			"event: superMessage4\n\n",
		);
		expect(spySend).toHaveBeenNthCalledWith(
			4,
			"event: superMessage4\ndata: ok\nid: tets\n\n",
		);
		expect(spySend).toHaveBeenNthCalledWith(
			5,
			"event: superMessage4\ndata: ok1\n\n",
		);
		expect(spySend).toHaveBeenNthCalledWith(
			6,
			"event: superMessage4\ndata: ok2\n\n",
		);
		expect(spySend).toHaveBeenNthCalledWith(
			7,
			"event: superMessage4\ndata: ok3\n\n",
		);
		expect(spySend).toHaveBeenNthCalledWith(
			8,
			"event: superMessage4\ndata: ok4\nretry: 72000000\n\n",
		);
		expect(spySend).toHaveBeenNthCalledWith(
			9,
			"event: superMessage4\ncontent-type: application/json\ndata: {\"super\":\"object\"}\nid: 10\nretry: 20\n\n",
		);
	});
});
