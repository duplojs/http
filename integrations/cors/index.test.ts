import { hub } from "@core";
import { createHttpServer } from "@duplojs/http/node";

describe("corsPlugin", async() => {
	const server = await createHttpServer(hub, {
		host: "0.0.0.0",
		port: 8949,
	});

	afterAll(() => {
		server.close();
	});

	it("simple request", async() => {
		await expect(
			fetch("http://localhost:8949/users", {
				method: "GET",
				headers: {
					Origin: "localhost",
				},
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
					"access-control-allow-credentials",
					"true",
				],
				[
					"access-control-allow-origin",
					"localhost",
				],
				[
					"access-control-expose-headers",
					"info",
				],
				[
					"vary",
					"Origin",
				],
				[
					"information",
					"users.findMany",
				],
			]),
		});
	});

	it("preflight request", async() => {
		await expect(
			fetch("http://localhost:8949/users", {
				method: "OPTIONS",
				headers: {
					Origin: "localhost",
				},
			})
				.then(async(response) => ({
					body: await response.text(),
					headers: [...response.headers.entries()],
					status: response.status,
				})),
		).resolves.toStrictEqual({
			body: "",
			status: 204,
			headers: expect.arrayContaining([
				[
					"access-control-allow-headers",
					"content-type,accept",
				],
				[
					"access-control-allow-methods",
					"GET,POST,DELETE",
				],
			]),
		});
	});

	it("cors flow", async() => {
		const preflightResponse = await fetch("http://localhost:8949/users", {
			method: "OPTIONS",
			headers: {
				Origin: "localhost",
			},
		});

		expect(preflightResponse.status).toBe(204);
		expect(await preflightResponse.text()).toBe("");
		expect([...preflightResponse.headers.entries()]).toEqual(
			expect.arrayContaining([
				[
					"access-control-allow-headers",
					"content-type,accept",
				],
			]),
		);

		const deleteResponse = await fetch("http://localhost:8949/users", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Origin: "localhost",
			},
			body: JSON.stringify({
				id: 23,
			}),
		});

		expect(deleteResponse.status).toBe(204);
		expect(await deleteResponse.text()).toBe("");
		expect([...deleteResponse.headers.entries()]).toEqual(
			expect.arrayContaining([
				[
					"access-control-allow-credentials",
					"true",
				],
				[
					"access-control-allow-origin",
					"localhost",
				],
				[
					"access-control-expose-headers",
					"info",
				],
				[
					"information",
					"users.deleted",
				],
				[
					"vary",
					"Origin",
				],
			]),
		);
	});
});
