import { hub } from "@core";
import { createHttpServer } from "@duplojs/http/node";
import { sleep } from "@duplojs/utils";
import { resolve } from "path";
import { EventSource } from "eventsource";

describe("server sent events", async() => {
	const server = await createHttpServer(hub, {
		host: "0.0.0.0",
		port: 8971,
		uploadFolder: resolve(import.meta.dirname, "../files/upload"),
	});

	process.chdir(resolve(import.meta.dirname, "../"));

	afterAll(() => {
		server.close();
	});

	it("stream and retry 2 time", async() => {
		const source = new EventSource("http://localhost:8971/sse");

		const spyMessage = vi.fn();
		const spyOther = vi.fn();
		source.addEventListener("message", ({ data }) => spyMessage(data));
		source.addEventListener("other", ({ data }) => spyOther(data));

		await sleep(1000);
		source.close();

		expect(spyMessage).toHaveBeenCalledTimes(4);
		expect(spyMessage).toHaveBeenNthCalledWith(1, "{\"test\":\"1\"}");
		expect(spyMessage).toHaveBeenNthCalledWith(2, "{\"test\":\"2\"}");
		expect(spyMessage).toHaveBeenNthCalledWith(3, "{\"test\":\"1\"}");
		expect(spyMessage).toHaveBeenNthCalledWith(4, "{\"test\":\"2\"}");

		expect(spyOther).toHaveBeenCalledTimes(2);
		expect(spyOther).toHaveBeenNthCalledWith(2, "3");
		expect(spyOther).toHaveBeenNthCalledWith(2, "3");
	});

	it("cancel connection", async() => {
		const source = new EventSource("http://localhost:8971/sse?close=true");

		const spyMessage = vi.fn();
		const spyOther = vi.fn();
		source.addEventListener("message", ({ data }) => spyMessage(data));
		source.addEventListener("other", ({ data }) => spyOther(data));

		await sleep(100);

		expect(spyMessage).toHaveBeenCalledTimes(0);
		expect(spyOther).toHaveBeenCalledTimes(0);
		expect(source.readyState).toBe(source.CLOSED);
	});
});
