import { Stream } from "@core";

describe("Stream", () => {
	const spyOnClose = vi.fn();
	const spyOnAbort = vi.fn();
	const spyOnError = vi.fn();

	afterEach(() => {
		vi.restoreAllMocks();
		vi.clearAllMocks();
	});

	it("does not start when already aborted", async() => {
		const spySend = vi.fn();
		const spyClose = vi.fn();
		const spyStart = vi.fn();

		const handler = Stream.init(spyStart);

		handler.abort();
		handler.abort();
		await handler.start(spySend, spyClose);

		expect(spyClose).toHaveBeenCalledTimes(0);
		expect(spySend).toHaveBeenCalledTimes(0);
		expect(spyStart).toHaveBeenCalledTimes(0);
	});

	it("sends each chunk and closes at the end", async() => {
		const spySend = vi.fn();
		const spyClose = vi.fn();

		const handler = Stream.init(async({ send, onClose, onAbort, onError }) => {
			onClose(spyOnClose);
			onAbort(spyOnAbort);
			onError(spyOnError);

			await send("test1", "test2", "test3");
		});

		await handler.start(spySend, spyClose);

		expect(spyOnClose).toHaveBeenCalledTimes(1);
		expect(spyOnAbort).toHaveBeenCalledTimes(0);
		expect(spyOnError).toHaveBeenCalledTimes(0);
		expect(spyClose).toHaveBeenCalledTimes(1);
		expect(spySend).toHaveBeenCalledTimes(3);
		expect(spySend).toHaveBeenNthCalledWith(1, "test1");
		expect(spySend).toHaveBeenNthCalledWith(2, "test2");
		expect(spySend).toHaveBeenNthCalledWith(3, "test3");
	});

	it("does not send after close and close is idempotent", async() => {
		const spySend = vi.fn();
		const spyClose = vi.fn();

		const handler = Stream.init(async({ send, close, onClose, onAbort, isClose, isAbort }) => {
			onClose(spyOnClose);
			onAbort(spyOnAbort);

			expect(isAbort()).toBe(false);
			expect(isClose()).toBe(false);

			await send("test1");
			close();
			close();
			await send("test2");

			expect(isAbort()).toBe(false);
			expect(isClose()).toBe(true);
		});

		await handler.start(spySend, spyClose);

		expect(spyOnClose).toHaveBeenCalledTimes(1);
		expect(spyOnAbort).toHaveBeenCalledTimes(0);
		expect(spyClose).toHaveBeenCalledTimes(1);
		expect(spySend).toHaveBeenCalledTimes(1);
		expect(spySend).toHaveBeenNthCalledWith(1, "test1");
	});

	it("does not send after abort and abort is idempotent", async() => {
		const spySend = vi.fn();
		const spyClose = vi.fn();

		const handler = Stream.init(async({ send, abort, onClose, onAbort, isClose, isAbort }) => {
			onClose(spyOnClose);
			onAbort(spyOnAbort);

			expect(isAbort()).toBe(false);
			expect(isClose()).toBe(false);

			await send("test1");
			abort();
			abort();
			await send("test2");

			expect(isAbort()).toBe(true);
			expect(isClose()).toBe(false);
		});

		await handler.start(spySend, spyClose);
		handler.abort();

		expect(spyOnClose).toHaveBeenCalledTimes(1);
		expect(spyOnAbort).toHaveBeenCalledTimes(1);
		expect(spyClose).toHaveBeenCalledTimes(1);
		expect(spySend).toHaveBeenCalledTimes(1);
		expect(spySend).toHaveBeenNthCalledWith(1, "test1");
	});

	it("forwards thrown errors to subscribers", async() => {
		const spySend = vi.fn();
		const spyClose = vi.fn();

		const handler = Stream.init(({ onClose, onAbort, onError }) => {
			onClose(spyOnClose);
			onAbort(spyOnAbort);
			onError(spyOnError);

			throw new Error("boom");
		});

		await handler.start(spySend, spyClose);

		expect(spyOnClose).toHaveBeenCalledTimes(1);
		expect(spyOnAbort).toHaveBeenCalledTimes(0);
		expect(spyOnError).toHaveBeenCalledWith(new Error("boom"));
		expect(spyClose).toHaveBeenCalledTimes(1);
		expect(spySend).toHaveBeenCalledTimes(0);
	});

	it("can emit manual errors", async() => {
		const spySend = vi.fn();
		const spyClose = vi.fn();

		const handler = Stream.init(async({ error, onError }) => {
			await Promise.resolve();
			onError(spyOnError);
			error("boom");
		});

		await handler.start(spySend, spyClose);

		expect(spyOnError).toHaveBeenCalledTimes(1);
		expect(spyOnError).toHaveBeenCalledWith("boom");
		expect(spyClose).toHaveBeenCalledTimes(1);
	});
});
