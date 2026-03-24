import { Request, Response } from "@core";
import "@plugin-cookie";
import { cookieHooks, parseRequestCookieHook, serializeResponseCookieHook } from "@plugin-cookie/hooks";
import { createBodyReader } from "@test-utils/bodyReader";

describe("cookie hooks", () => {
	it("parseRequestCookieHook parses a string cookie header", () => {
		const parser = vi.fn(() => ({ session: "value" }));
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
		const next = vi.fn(() => "next-value");
		const hook = parseRequestCookieHook({ parser });

		const result = hook.beforeRouteExecution(
			{
				request,
				next: next as never,
				exit: () => null as never,
				response: () => null as never,
			},
		);

		expect(result).toBe("next-value");
		expect(parser).toHaveBeenCalledExactlyOnceWith("session=value");
		expect(next).toHaveBeenCalledExactlyOnceWith();
		expect(request.cookies).toStrictEqual({ session: "value" });
	});

	it("parseRequestCookieHook joins array headers and keeps cookies untouched when absent", () => {
		const parser = vi.fn(() => ({ theme: "dark" }));
		const requestWithArray = new Request({
			method: "GET",
			headers: {
				cookie: ["session=value", "theme=dark"],
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
		const requestWithoutCookie = new Request({
			method: "GET",
			headers: {},
			url: "http://localhost/test",
			host: "localhost",
			origin: "http://localhost",
			matchedPath: null,
			params: {},
			path: "/test",
			query: {},
			bodyReader: createBodyReader(),
		});
		const hook = parseRequestCookieHook({ parser });

		hook.beforeRouteExecution!(
			{
				request: requestWithArray,
				next: () => undefined as never,
				exit: () => null as never,
				response: () => null as never,
			},
		);
		hook.beforeRouteExecution!(
			{
				request: requestWithoutCookie,
				next: () => undefined as never,
				exit: () => null as never,
				response: () => null as never,
			},
		);

		expect(parser).toHaveBeenCalledExactlyOnceWith("session=value; theme=dark");
		expect(requestWithArray.cookies).toStrictEqual({ theme: "dark" });
		expect(requestWithoutCookie.cookies).toBeUndefined();
	});

	it("serializeResponseCookieHook serializes stored cookies into the Set-Cookie header", () => {
		const serializer = vi.fn((name: string) => `${name}=serialized`);
		const response = new Response("200", "ok", undefined);
		response.setCookie("session", "value");
		response.setCookie("theme", "dark");
		const next = vi.fn(() => "done");
		const hook = serializeResponseCookieHook({ serializer });

		const result = hook.beforeSendResponse!(
			{
				request: undefined as never,
				currentResponse: response,
				next: next as never,
				exit: () => null as never,
			},
		);

		expect(result).toBe("done");
		expect(serializer).toHaveBeenNthCalledWith(
			1,
			"session",
			"value",
			undefined,
		);
		expect(serializer).toHaveBeenNthCalledWith(
			2,
			"theme",
			"dark",
			undefined,
		);
		expect(response.headers?.["set-cookie"]).toStrictEqual([
			"session=serialized",
			"theme=serialized",
		]);
		expect(next).toHaveBeenCalledExactlyOnceWith();
	});

	it("serializeResponseCookieHook skips header emission when no cookie is stored", () => {
		const serializer = vi.fn();
		const response = new Response("200", "ok", undefined);
		const next = vi.fn(() => undefined);
		const hook = serializeResponseCookieHook({ serializer });

		hook.beforeSendResponse!(
			{
				request: undefined as never,
				currentResponse: response,
				next: next as never,
				exit: () => null as never,
			},
		);

		expect(serializer).not.toHaveBeenCalled();
		expect(response.headers?.["set-cookie"]).toBeUndefined();
		expect(next).toHaveBeenCalledExactlyOnceWith();
	});

	it("cookieHooks combines request parsing and response serialization", () => {
		const parser = vi.fn(() => ({ session: "parsed" }));
		const serializer = vi.fn((name: string) => `${name}=serialized`);
		const hook = cookieHooks({
			parser,
			serializer,
		});
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
		const response = new Response("200", "ok", undefined);
		response.setCookie("session", "value");

		hook.beforeRouteExecution!(
			{
				request,
				next: () => undefined as never,
				exit: () => null as never,
				response: () => null as never,
			},
		);
		hook.beforeSendResponse!(
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
		expect(response.headers?.["set-cookie"]).toStrictEqual(["session=serialized"]);
	});

	it("cookieHooks uses default parser and serializer when params are omitted", () => {
		const hook = cookieHooks();
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
		const response = new Response("200", "ok", undefined);
		response.setCookie("session", "value");

		hook.beforeRouteExecution!(
			{
				request,
				next: () => undefined as never,
				exit: () => null as never,
				response: () => null as never,
			},
		);
		hook.beforeSendResponse!(
			{
				request,
				currentResponse: response,
				next: () => undefined as never,
				exit: () => null as never,
			},
		);

		expect(request.cookies).toStrictEqual({ session: "value" });
		expect(response.headers?.["set-cookie"]).toStrictEqual(["session=value"]);
	});
});
