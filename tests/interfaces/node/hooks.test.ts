import { makeNodeHook, BodyParseUnknownError, BodyParseWrongChunkReceived, BodySizeExceedsLimitError } from "@interface-node";
import { HookResponse, type HttpServerParams, Response, createHub, exitHookFunction } from "@core";
import { createFakeRequest } from "@test-utils/request";
import { testHub } from "@test-utils/hub";

describe("makeNodeHook", () => {
	const baseServerParams: HttpServerParams = {
		interface: "node",
		host: "localhost",
		port: 3000,
		maxBodySize: 100,
		informationHeaderKey: "information",
		fromHookHeaderKey: "from-hook",
	};

	const hooks = makeNodeHook(testHub, baseServerParams);

	describe("parseBody", () => {
		it("exits when content-type is unsupported", async() => {
			const request = createFakeRequest({
				headers: { "content-type": "application/xml" },
			});

			await hooks.parseBody({
				request,
				exit: exitHookFunction,
			} as any);

			expect(request.body).toBeUndefined();
		});

		it("parses text/plain body", async() => {
			const request = createFakeRequest({
				headers: { "content-type": "text/plain" },
			});

			const promise = hooks.parseBody({
				request,
				exit: exitHookFunction,
			} as any);

			request.raw.request.emit("data", "hello");
			request.raw.request.emit("end");

			await promise;

			expect(request.body).toBe("hello");
		});

		it("parses text/plain body when content-type is an array", async() => {
			const request = createFakeRequest({
				headers: { "content-type": ["text/plain"] as any },
			});

			const promise = hooks.parseBody({
				request,
				exit: exitHookFunction,
			} as any);

			request.raw.request.emit("data", "hello");
			request.raw.request.emit("end");

			await promise;

			expect(request.body).toBe("hello");
		});

		it("parses application/json body", async() => {
			const request = createFakeRequest({
				headers: { "content-type": "application/json" },
			});

			const promise = hooks.parseBody({
				request,
				exit: exitHookFunction,
			} as any);

			request.raw.request.emit("data", Buffer.from(JSON.stringify({ aa: 1 })));
			request.raw.request.emit("end");

			await promise;

			expect(request.body).toStrictEqual({ aa: 1 });
		});

		it("rejects when chunk type is invalid", async() => {
			const request = createFakeRequest({
				headers: { "content-type": "text/plain" },
			});

			const promise = hooks.parseBody!({
				request,
				exit: exitHookFunction,
			} as any);

			request.raw.request.emit("data", 12);

			await expect(promise).rejects.toBeInstanceOf(BodyParseWrongChunkReceived);
		});

		it("rejects when body exceeds max size", async() => {
			const hook = makeNodeHook(testHub, {
				...baseServerParams,
				maxBodySize: 5,
			});

			const request = createFakeRequest({
				headers: { "content-type": "text/plain" },
			});

			const promise = hook.parseBody!({
				request,
				exit: exitHookFunction,
			} as any);

			request.raw.request.emit("data", "123456");

			await expect(promise).rejects.toBeInstanceOf(BodySizeExceedsLimitError);
		});

		it("wraps unknown parse error", async() => {
			const request = createFakeRequest({
				headers: { "content-type": "application/json" },
			});

			const promise = hooks.parseBody!({
				request,
				exit: vi.fn(),
			} as any);

			request.raw.request.emit("data", "{invalid-json");
			request.raw.request.emit("end");

			await expect(promise).rejects.toBeInstanceOf(BodyParseUnknownError);
		});

		it("exits immediately when content-type is missing", async() => {
			const request = createFakeRequest();

			await hooks.parseBody({
				request,
				exit: exitHookFunction,
			} as any);

			expect(request.body).toBeUndefined();
		});
	});

	describe("error hook", () => {
		it("handle BodySizeExceedsLimitError", () => {
			const response = vi.fn();
			const exit = vi.fn();

			hooks.error({
				error: new BodySizeExceedsLimitError(10),
				response,
				exit,
			} as any);

			expect(response).toHaveBeenLastCalledWith(
				"400",
				"body-size-exceeds-limit-error",
				expect.any(BodySizeExceedsLimitError),
			);
		});

		it("handle BodyParseWrongChunkReceived", () => {
			const response = vi.fn();
			const exit = vi.fn();

			hooks.error({
				error: new BodyParseWrongChunkReceived("oops"),
				response,
				exit,
			} as any);

			expect(response).toHaveBeenLastCalledWith(
				"400",
				"body-parse-wrong-chunk-received",
				expect.any(BodyParseWrongChunkReceived),
			);

			hooks.error({
				error: new BodyParseUnknownError("application/json", new Error("parse")),
				response,
				exit,
			} as any);
			expect(response).toHaveBeenLastCalledWith(
				"400",
				"body-parse-unknown-error",
				expect.any(BodyParseUnknownError),
			);
		});

		it("omits error body when not in dev and exits for unknown errors", () => {
			const hub = createHub({ environment: "PROD" });
			const prodHooks = makeNodeHook(
				hub,
				baseServerParams,
			);
			const response = vi.fn();
			const exit = vi.fn();

			prodHooks.error({
				error: new BodyParseUnknownError("application/json", new Error("parse")),
				response,
				exit,
			} as any);

			expect(response).toHaveBeenLastCalledWith(
				"400",
				"body-parse-unknown-error",
				undefined,
			);

			prodHooks.error({
				error: new Error("other"),
				response,
				exit,
			} as any);

			expect(exit).toHaveBeenCalled();
		});
	});

	describe("beforeSendResponse", () => {
		it("sets headers and calls writeHead", () => {
			const request = createFakeRequest();
			const writeHeadSpy = vi.spyOn(request.raw.response, "writeHead");
			const currentResponse = new Response("200", "ok", { ok: true });

			hooks.beforeSendResponse({
				request,
				currentResponse,
				exit: exitHookFunction,
			} as any);

			expect(currentResponse.headers).toStrictEqual({
				"content-type": "application/json; charset=utf-8",
				[baseServerParams.informationHeaderKey]: "ok",
			});
			expect(writeHeadSpy).toHaveBeenCalledWith(
				200,
				currentResponse.headers,
			);
		});

		it("adds from-hook header for HookResponse", () => {
			const request = createFakeRequest();
			const currentResponse = new HookResponse("parseBody", "200", "info", "data");

			hooks.beforeSendResponse({
				request,
				currentResponse,
				exit: exitHookFunction,
			} as any);

			expect(currentResponse.headers).toStrictEqual({
				"content-type": "text/plain; charset=utf-8",
				[baseServerParams.informationHeaderKey]: "info",
				[baseServerParams.fromHookHeaderKey]: "parseBody",
			});
		});

		it("sets text/plain for string body", () => {
			const request = createFakeRequest();
			const currentResponse = new Response("200", "str", "value");

			hooks.beforeSendResponse!({
				request,
				currentResponse,
				exit: exitHookFunction,
			} as any);

			expect(currentResponse.headers).toStrictEqual({
				"content-type": "text/plain; charset=utf-8",
				[baseServerParams.informationHeaderKey]: "str",
			});
		});

		it("un support body value", () => {
			const request = createFakeRequest();
			const currentResponse = new Response("200", "fnc", (() => {}));

			hooks.beforeSendResponse!({
				request,
				currentResponse,
				exit: exitHookFunction,
			} as any);

			expect(currentResponse.headers).toStrictEqual({
				[baseServerParams.informationHeaderKey]: "fnc",
			});
		});
	});

	describe("sendResponse", () => {
		it("writes object body", () => {
			const request = createFakeRequest();

			hooks.sendResponse!({
				request,
				currentResponse: { body: { ok: true } },
				exit: exitHookFunction,
			} as any);

			expect(request.raw.response._getData()).toBe(JSON.stringify({ ok: true }));
			expect(request.raw.response._isEndCalled()).toBe(true);
		});

		it("writes string body", () => {
			const request = createFakeRequest();

			hooks.sendResponse!({
				request,
				currentResponse: { body: "text" },
				exit: exitHookFunction,
			} as any);

			expect(request.raw.response._getData()).toBe("text");
			expect(request.raw.response._isEndCalled()).toBe(true);
		});

		it("writes number body", () => {
			const request = createFakeRequest();

			hooks.sendResponse!({
				request,
				currentResponse: { body: 42 },
				exit: exitHookFunction,
			} as any);

			expect(request.raw.response._getData()).toBe("42");
			expect(request.raw.response._isEndCalled()).toBe(true);
		});

		it("writes bigint body", () => {
			const request = createFakeRequest();

			hooks.sendResponse!({
				request,
				currentResponse: { body: 12n },
				exit: exitHookFunction,
			} as any);

			expect(request.raw.response._getData()).toBe("12");
			expect(request.raw.response._isEndCalled()).toBe(true);
		});

		it("writes error body", () => {
			const request = createFakeRequest();

			hooks.sendResponse!({
				request,
				currentResponse: { body: new Error("boom") },
				exit: exitHookFunction,
			} as any);

			expect(request.raw.response._getData()).toBe("Error: boom");
			expect(request.raw.response._isEndCalled()).toBe(true);
		});

		it("writes nothing for unsupported types", () => {
			const request = createFakeRequest();

			hooks.sendResponse!({
				request,
				currentResponse: { body: (() => {}) },
				exit: exitHookFunction,
			} as any);

			expect(request.raw.response._getData()).toBe("");
			expect(request.raw.response._isEndCalled()).toBe(true);
		});
	});
});
