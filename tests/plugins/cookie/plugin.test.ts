import { Request, Response } from "@core";
import { cookiePlugin } from "@plugin-cookie";
import { createBodyReader } from "@test-utils/bodyReader";

describe("cookie plugin", () => {
	it("returns the plugin definition with both route lifecycle hooks", () => {
		const plugin = cookiePlugin()();

		expect(plugin).toStrictEqual({
			name: "cookie-plugin",
			hooksRouteLifeCycle: [
				expect.objectContaining({
					beforeRouteExecution: expect.any(Function),
				}),
				expect.objectContaining({
					beforeSendResponse: expect.any(Function),
				}),
			],
		});
	});

	it("wires custom parser and serializer through generated hooks", async() => {
		const parser = vi.fn(() => ({ session: "parsed" }));
		const serializer = vi.fn((name: string) => `${name}=custom`);
		const plugin = cookiePlugin({
			parser,
			serializer,
		})();
		const hooks = plugin.hooksRouteLifeCycle!;
		const request = new Request({
			method: "GET",
			headers: {
				cookie: "session=value",
			},
			url: "http://localhost/test",
			host: "localhost",
			origin: "http://localhost",
			matchedPath: null,
			params: {},
			path: "/test",
			query: {},
			bodyReader: createBodyReader(),
		});
		const response = new Response("200", "ok", undefined)
			.setCookie("session", "value");

		await hooks[0]!.beforeRouteExecution!(
			{
				request,
				next: () => undefined as never,
				exit: () => null as never,
				response: () => null as never,
			},
		);
		await hooks[1]!.beforeSendResponse!(
			{
				request,
				currentResponse: response,
				next: () => undefined as never,
				exit: () => null as never,
			},
		);

		expect(parser).toHaveBeenCalledExactlyOnceWith("session=value");
		expect(request.cookies).toStrictEqual({ session: "parsed" });
		expect(serializer).toHaveBeenCalledExactlyOnceWith("session", "value", undefined);
		expect(response.headers?.["set-cookie"]).toStrictEqual(["session=custom"]);
	});
});
