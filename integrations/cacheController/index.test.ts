import { createHttpServer } from "@duplojs/http/node";
import { hub } from "@core";

describe("cacheController", async() => {
	const server = await createHttpServer(hub, {
		host: "0.0.0.0",
		port: 8947,
	});

	afterAll(() => {
		server.close();
	});

	it("route is good", async() => {
		await expect(
			fetch("http://localhost:8947/users", {
				method: "GET",
			})
				.then(async(response) => ({
					body: await response.json(),
					headers: [...response.headers.entries()],
				})),
		).resolves.toStrictEqual({
			body: [
				{
					age: 28,
					id: 23,
					name: "",
				},
			],
			headers: expect.arrayContaining([
				[
					"information",
					"users.findMany",
				],
				[
					"cache-control",
					"max-age=200,private=\"authorization,cookie\",no-cache=\"set-cookie\"",
				],
			]),
		});

		server.close();
	});
});
