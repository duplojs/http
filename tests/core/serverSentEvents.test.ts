import { ServerSentEvents, ServerSentEventsPredictedResponse } from "@core";

describe("ServerSentEvents", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("formats string, multiline string, object, undefined and params", async() => {
		const spySend = vi.fn();
		const spyClose = vi.fn();

		const handler = ServerSentEvents.init(
			async({ send, lastId }) => {
				expect(lastId).toBe("test");

				await send("", "test1");
				await send("multi", "line1\nline2\rline3\r\nline4");
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
			{
				lastId: "test",
			},
		);

		await handler.start(spySend, spyClose);

		expect(spyClose).toHaveBeenCalledTimes(1);
		expect(spySend).toHaveBeenCalledTimes(10);
		expect(spySend).toHaveBeenNthCalledWith(
			1,
			"event: message\ndata: test1\n\n",
		);
		expect(spySend).toHaveBeenNthCalledWith(
			2,
			"event: multi\ndata: line1\ndata: line2\ndata: line3\ndata: line4\n\n",
		);
		expect(spySend).toHaveBeenNthCalledWith(
			3,
			"event: superMessage4\ncontent-type: application/json\ndata: {\"super\":\"object\"}\n\n",
		);
		expect(spySend).toHaveBeenNthCalledWith(
			4,
			"event: superMessage4\n\n",
		);
		expect(spySend).toHaveBeenNthCalledWith(
			5,
			"event: superMessage4\ndata: ok\nid: tets\n\n",
		);
		expect(spySend).toHaveBeenNthCalledWith(
			6,
			"event: superMessage4\ndata: ok1\n\n",
		);
		expect(spySend).toHaveBeenNthCalledWith(
			7,
			"event: superMessage4\ndata: ok2\n\n",
		);
		expect(spySend).toHaveBeenNthCalledWith(
			8,
			"event: superMessage4\ndata: ok3\n\n",
		);
		expect(spySend).toHaveBeenNthCalledWith(
			9,
			"event: superMessage4\ndata: ok4\nretry: 72000000\n\n",
		);
		expect(spySend).toHaveBeenNthCalledWith(
			10,
			"event: superMessage4\ncontent-type: application/json\ndata: {\"super\":\"object\"}\nid: 10\nretry: 20\n\n",
		);
	});

	it("stops serializing when the stream is closed", async() => {
		const spySend = vi.fn();
		const spyClose = vi.fn();

		const handler = ServerSentEvents.init(
			async({ send, close, isClose, isAbort }) => {
				expect(isAbort()).toBe(false);
				expect(isClose()).toBe(false);

				await send("superMessage", "test1");
				close();
				await send("superMessage", "test2");

				expect(isAbort()).toBe(false);
				expect(isClose()).toBe(true);
			},
			{
				lastId: null,
			},
		);

		await handler.start(spySend, spyClose);

		expect(spyClose).toHaveBeenCalledTimes(1);
		expect(spySend).toHaveBeenCalledTimes(1);
		expect(spySend).toHaveBeenNthCalledWith(
			1,
			"event: superMessage\ndata: test1\n\n",
		);
	});

	it("stops serializing when the stream is aborted", async() => {
		const spySend = vi.fn();
		const spyClose = vi.fn();

		const handler = ServerSentEvents.init(
			async({ send, abort, isClose, isAbort }) => {
				expect(isAbort()).toBe(false);
				expect(isClose()).toBe(false);

				await send("superMessage", "test1");
				abort();
				await send("superMessage", "test2");

				expect(isAbort()).toBe(true);
				expect(isClose()).toBe(false);
			},
			{
				lastId: null,
			},
		);

		await handler.start(spySend, spyClose);

		expect(spyClose).toHaveBeenCalledTimes(1);
		expect(spySend).toHaveBeenCalledTimes(1);
		expect(spySend).toHaveBeenNthCalledWith(
			1,
			"event: superMessage\ndata: test1\n\n",
		);
	});
});
