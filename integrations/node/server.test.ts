import { hub } from "@core";
import { createHttpServer } from "@duplojs/http/node";

describe("node server", async() => {
	const server = await createHttpServer(hub, {
		host: "0.0.0.0",
		port: 8948,
	});

	afterAll(() => {
		server.close();
	});

	it("get all users", async() => {
		await expect(
			fetch("http://localhost:8948/users", { method: "GET" })
				.then(async(response) => ({
					body: await response.json(),
					headers: [...response.headers.entries()],
				})),
		).resolves.toStrictEqual({
			headers: expect.arrayContaining([
				[
					"information",
					"users.findMany",
				],
				[
					"content-type",
					"application/json; charset=utf-8",
				],
				[
					"predicted",
					"1",
				],
			]),
			body: [
				{
					age: 28,
					id: 23,
					name: "",
				},
			],
		});
	});

	it("get user", async() => {
		await expect(
			fetch("http://localhost:8948/users/15", { method: "GET" })
				.then(async(response) => ({
					body: await response.json(),
					headers: [...response.headers.entries()],
				})),
		).resolves.toStrictEqual({
			headers: expect.arrayContaining([
				[
					"information",
					"users.find",
				],
				[
					"content-type",
					"application/json; charset=utf-8",
				],
				[
					"predicted",
					"1",
				],
			]),
			body: {
				age: 28,
				id: 15,
				name: "",
			},
		});
	});

	it("port user", async() => {
		await expect(
			fetch("http://localhost:8948/users", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					id: 5,
					name: "math",
					age: 23,
				}),
			})
				.then(async(response) => ({
					body: await response.json(),
					headers: [...response.headers.entries()],
				})),
		).resolves.toStrictEqual({
			headers: expect.arrayContaining([
				[
					"information",
					"users.create",
				],
				[
					"content-type",
					"application/json; charset=utf-8",
				],
				[
					"predicted",
					"1",
				],
			]),
			body: {
				age: 23,
				id: 5,
				name: "math",
			},
		});
	});
});
