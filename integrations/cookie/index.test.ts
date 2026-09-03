import { hub } from "@core";
import { createHttpServer } from "@duplojs/http/node";

describe("cookie plugin", async() => {
	const server = await createHttpServer(hub, {
		host: "0.0.0.0",
		port: 8962,
	});

	afterAll(() => {
		server.close();
	});

	it("expect good", async() => {
		await expect(
			fetch("http://localhost:8962/cookie-check", {
				method: "GET",
				headers: {
					Cookie: "session=abc%20123",
				},
			}).then(async(response) => ({
				status: response.status,
				body: await response.json(),
				headers: [...response.headers.entries()],
			})),
		).resolves.toStrictEqual({
			status: 200,
			headers: expect.arrayContaining([
				[
					"information",
					"cookie.checked",
				],
				[
					"set-cookie",
					"refresh=next-token; Path=/; HttpOnly; SameSite=Lax",
				],
			]),
			body: {
				session: "abc 123",
			},
		});
	});

	it("drops cookie", async() => {
		await expect(
			fetch("http://localhost:8962/cookie-drop", {
				method: "GET",
			}).then((response) => ({
				status: response.status,
				headers: [...response.headers.entries()],
			})),
		).resolves.toStrictEqual({
			status: 204,
			headers: expect.arrayContaining([
				[
					"information",
					"cookie.dropped",
				],
				[
					"set-cookie",
					"session=; Max-Age=0",
				],
			]),
		});
	});
});
