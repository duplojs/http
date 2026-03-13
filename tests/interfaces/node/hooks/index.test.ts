import { fsSpy } from "@test-utils/fs";
import { type HttpServerParams, Response, ServerSentEventsPredictedResponse, exitHookFunction, nextHookFunction } from "@core";
import { createFakeRequest } from "@test-utils/request";
import { initNodeHook } from "@interface-node";
import { setEnvironment, SF, TESTImplementation } from "@duplojs/server-utils";
import { EventEmitter } from "stream";
import { testHub } from "@test-utils/hub";
import { sleep } from "@duplojs/utils";

describe("makeNodeHook", () => {
	beforeEach(() => {
		setEnvironment("TEST");
		TESTImplementation.clear();
	});
	const baseServerParams: HttpServerParams = {
		interface: "node",
		host: "localhost",
		port: 3000,
		maxBodySize: 100,
		informationHeaderKey: "information",
		fromHookHeaderKey: "from-hook",
		predictedHeaderKey: "predicted",
		uploadFolder: "./upload",
	};

	const hooks = initNodeHook(testHub, baseServerParams);

	describe("beforeSendResponse", () => {
		it("sets headers and calls writeHead", () => {
			const request = createFakeRequest();
			const writeHeadSpy = vi.spyOn(request.raw.response, "writeHead");
			const currentResponse = new Response("205", "ok", { ok: true })
				.setHeader("content-type", "application/json; charset=utf-8");

			hooks.beforeSendResponse({
				request,
				currentResponse,
				exit: exitHookFunction,
			} as any);

			expect(writeHeadSpy).toHaveBeenCalledWith(
				205,
				{
					"content-type": "application/json; charset=utf-8",
				},
			);
		});
	});

	describe("sendResponse", () => {
		it("writes object body", async() => {
			const request = createFakeRequest();

			await hooks.sendResponse!({
				request,
				currentResponse: { body: { ok: true } },
				exit: exitHookFunction,
			} as any);

			expect(request.raw.response._getData()).toBe(JSON.stringify({ ok: true }));
			expect(request.raw.response._isEndCalled()).toBe(true);
		});

		it("writes string body", async() => {
			const request = createFakeRequest();

			await hooks.sendResponse!({
				request,
				currentResponse: { body: "text" },
				exit: exitHookFunction,
			} as any);

			expect(request.raw.response._getData()).toBe("text");
			expect(request.raw.response._isEndCalled()).toBe(true);
		});

		it("writes number body", async() => {
			const request = createFakeRequest();

			await hooks.sendResponse!({
				request,
				currentResponse: { body: 42 },
				exit: exitHookFunction,
			} as any);

			expect(request.raw.response._getData()).toBe("42");
			expect(request.raw.response._isEndCalled()).toBe(true);
		});

		it("writes error body", async() => {
			const request = createFakeRequest();

			await hooks.sendResponse!({
				request,
				currentResponse: { body: new Error("boom") },
				exit: exitHookFunction,
			} as any);

			expect(request.raw.response._getData()).toBe("Error: boom");
			expect(request.raw.response._isEndCalled()).toBe(true);
		});

		it("writes nothing for unsupported types", async() => {
			const request = createFakeRequest();

			await hooks.sendResponse!({
				request,
				currentResponse: { body: (() => {}) },
				exit: exitHookFunction,
			} as any);

			expect(request.raw.response._getData()).toBe("");
			expect(request.raw.response._isEndCalled()).toBe(true);
		});

		it("writes file body", async() => {
			const request = createFakeRequest({
				raw: {
					response: {
						eventEmitter: EventEmitter,
					},
				},
			});

			fsSpy.createReadStream.mockImplementation(() => ({
				pipe: (arg: any) => {
					expect(arg).toBe(request.raw.response);
				},
			}));

			setTimeout(() => {
				request.raw.response.emit("close");
			});

			await hooks.sendResponse({
				request,
				currentResponse: { body: SF.createFileInterface("test.txt") },
				exit: exitHookFunction,
			} as any);

			expect(fsSpy.createReadStream).toBeCalledWith("test.txt");
		});
		describe("serverSentEvent", () => {
			it("send events", async() => {
				const request = createFakeRequest();

				const write = request.raw.response.write;
				request.raw.response.write = vi.fn()
					.mockImplementationOnce(
						(data) => {
							write(data);
							void sleep().then(() => request.raw.response.emit("drain"));
							return false;
						},
					)
					.mockImplementationOnce(
						(data) => {
							write(data);
							return true;
						},
					);

				await hooks.sendResponse({
					request,
					currentResponse: new ServerSentEventsPredictedResponse(
						"200",
						"test",
						async({ send }) => {
							await send("test", "ok");
							await send("test", "ok2");
						},
					),
					exit: exitHookFunction,
				} as any);

				await sleep(1000);

				expect(request.raw.response._getData()).toBe(
					"event: test\ndata: ok\n\nevent: test\ndata: ok2\n\n",
				);
				expect(request.raw.response._isEndCalled()).toBe(true);
			});

			it("client close request", async() => {
				const spyOnAbort = vi.fn();
				const request = createFakeRequest();

				await hooks.sendResponse({
					request,
					currentResponse: new ServerSentEventsPredictedResponse(
						"200",
						"test",
						({ send, onAbort }) => {
							onAbort(spyOnAbort);
						},
					),
					exit: exitHookFunction,
				} as any);

				await sleep();

				expect(spyOnAbort).toHaveBeenCalledTimes(0);
				request.raw.request.emit("close");
				expect(spyOnAbort).toHaveBeenCalledTimes(1);
			});

			it("client close request", async() => {
				const spyOnAbort = vi.fn();
				const request = createFakeRequest();

				await hooks.sendResponse({
					request,
					currentResponse: new ServerSentEventsPredictedResponse(
						"200",
						"test",
						({ send, onAbort }) => {
							onAbort(spyOnAbort);
						},
					),
					exit: exitHookFunction,
				} as any);

				await sleep();

				expect(spyOnAbort).toHaveBeenCalledTimes(0);
				request.raw.request.emit("close");
				expect(spyOnAbort).toHaveBeenCalledTimes(1);
			});

			it("inject lastId", async() => {
				const spyLastId = vi.fn();
				const request = createFakeRequest({
					headers: { "last-event-id": "test" },
				});

				await hooks.sendResponse({
					request,
					currentResponse: new ServerSentEventsPredictedResponse(
						"200",
						"test",
						({ send, onAbort, lastId }) => spyLastId(lastId),
					),
					exit: exitHookFunction,
				} as any);

				await sleep();

				expect(spyLastId).toHaveBeenCalledWith("test");
			});
		});
	});

	describe("afterSendResponse", () => {
		it("delete filesAttache", async() => {
			const spy = TESTImplementation.set("remove", vi.fn());
			const request = createFakeRequest();

			request.filesAttache = ["test.txt", "tot.png"];

			await hooks.afterSendResponse!({
				request,
				next: nextHookFunction,
			} as any);

			expect(spy).toHaveBeenNthCalledWith(
				1,
				"test.txt",
			);
			expect(spy).toHaveBeenNthCalledWith(
				2,
				"tot.png",
			);
		});

		it("not delete filesAttache", async() => {
			const spy = TESTImplementation.set("remove", vi.fn());
			const request = createFakeRequest();

			await hooks.afterSendResponse!({
				request,
				next: nextHookFunction,
			} as any);

			expect(spy).not.toHaveBeenCalled();
		});
	});
});
