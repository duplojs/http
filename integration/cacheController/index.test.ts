import { createCacheControllerHook } from "@duplojs/http/cacheController";
import { createHub, ResponseContract, useRouteBuilder } from "@duplojs/http";
import { createHttpServer } from "@duplojs/http/node";
import { DP } from "@duplojs/utils";

describe("cacheController", () => {
	it("route is good", async() => {
		const route = useRouteBuilder("GET", "/", {
			hooks: [
				createCacheControllerHook({
					response: {
						private: ["authorization", "cookie"],
						noCache: ["set-cookie"],
						maxAge: 200,
					},
				}),
			],
		})
			.handler(
				ResponseContract.ok("test", DP.boolean()),
				(__, { response, request }) => response(
					"test",
					request.getCacheControlDirective("noStore"),
				),
			);

		const hub = createHub({ environment: "DEV" }).register(route);
		const server = await createHttpServer(hub, {
			host: "0.0.0.0",
			port: 8947,
		});

		interface Routes {
			method: "GET";
			path: "/";
			responses: {
				code: "200";
				information: "test";
				body: boolean;
			};
		}

		await expect(
			fetch("http://localhost:8947/", {
				method: "GET",
			})
				.then(async(response) => ({
					body: await response.text(),
					headers: [...response.headers.entries()],
				})),
		).resolves.toStrictEqual({
			body: "false",
			headers: expect.arrayContaining([
				[
					"information",
					"test",
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
