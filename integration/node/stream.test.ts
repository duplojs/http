import { hub } from "@core";
import { createHttpServer } from "@duplojs/http/node";

describe("stream", async() => {
	const server = await createHttpServer(hub, {
		host: "0.0.0.0",
		port: 8653,
	});

	afterAll(() => {
		server.close();
	});

	it("simple stream", async() => {
		await expect(
			fetch("http://localhost:8653/stream?value=12", { method: "GET" })
				.then(async(response) => ({
					body: await response.text(),
					headers: [...response.headers.entries()],
				})),
		).resolves.toStrictEqual({
			headers: expect.arrayContaining([
				[
					"information",
					"monSuperStream",
				],
				[
					"transfer-encoding",
					"chunked",
				],
				[
					"content-type",
					"application/octet-stream",
				],
				[
					"predicted",
					"1",
				],
			]),
			body: "1234512",
		});
	});

	it("stream text", async() => {
		await expect(
			fetch("http://localhost:8653/stream-text", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ value: "<3" }),
			})
				.then(async(response) => ({
					body: await response.text(),
					headers: [...response.headers.entries()],
				})),
		).resolves.toStrictEqual({
			headers: expect.arrayContaining([
				[
					"information",
					"monSuperStream",
				],
				[
					"transfer-encoding",
					"chunked",
				],
				[
					"content-type",
					"text/plain; charset=UTF-8",
				],
				[
					"predicted",
					"1",
				],
			]),
			body: "superValueDeLaMort <3",
		});
	});
});
