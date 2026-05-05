import { ResponseContract, useRouteBuilder, Request, Response, PredictedResponse, type ServerSentEventsPredictedResponse, type StreamPredictedResponse, type StreamTextPredictedResponse } from "@core";
import { DP, DPE } from "@duplojs/utils";
import { useTestRouteFunctionBuilder } from "@test-utils/useTestRouteFunctionBuilder";
import { createBodyReader } from "@test-utils/bodyReader";

describe("handler step function builder", () => {
	const spyResponse = vi.fn();

	beforeEach(() => {
		spyResponse.mockClear();
	});

	it("response from handler", async() => {
		const route = useRouteBuilder("GET", "/test/{value}", { hooks: [{ afterSendResponse: spyResponse }] })
			.extract({ params: { value: DPE.string() } })
			.handler(
				ResponseContract.ok("good", DPE.string()),
				(floor, { response }) => response("good", floor.value),
			);

		const buildedRoute = await useTestRouteFunctionBuilder(route);

		await buildedRoute(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "",
				path: "",
				params: { value: "test" },
				query: {},
				url: "",
				bodyReader: createBodyReader(),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse("200", "good", "test"),
			}),
		);
	});

	it("missing contract error", async() => {
		const route = useRouteBuilder("GET", "/test", { hooks: [{ afterSendResponse: spyResponse }] })
			.handler(
				ResponseContract.noContent("good"),
				(floor, { response }) => response("wrongInfo" as any),
			);

		const buildedRoute = await useTestRouteFunctionBuilder(route);

		await buildedRoute(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "",
				path: "",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new Response("500", "server-error", new ResponseContract.Error("wrongInfo", "Contract not found.")),
			}),
		);
	});

	it("contract error", async() => {
		const route = useRouteBuilder("GET", "/test", { hooks: [{ afterSendResponse: spyResponse }] })
			.handler(
				[ResponseContract.ok("good", DPE.string().max(3))],
				(floor, { response }) => response("good", "1234"),
			);

		const buildedRoute = await useTestRouteFunctionBuilder(route);

		await buildedRoute(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "",
				path: "",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new Response(
					"500",
					"server-error",
					new ResponseContract.Error(
						"good",
						expect.objectContaining({ [DP.errorKind.runTimeKey]: null }),
					),
				),
			}),
		);
	});

	it("serverSentEventsResponse from handler", async() => {
		const response = await new Promise<ServerSentEventsPredictedResponse>((resolve) => {
			const route = useRouteBuilder("GET", "/test", {
				hooks: [
					{
						afterSendResponse: ({ currentResponse, next }) => {
							void resolve(currentResponse as never);
							return next();
						},
					},
				],
			})
				.handler(
					ResponseContract.serverSentEvents("good", DPE.string(), { ping: DPE.object({ value: DPE.number() }) }),
					(floor, { serverSentEventsResponse }) => serverSentEventsResponse("good", async({ send }) => {
						await send("ping", { value: 2 });
						await send("message", "test2");
					}),
				);

			void useTestRouteFunctionBuilder(route)
				.then(
					(buildedRoute) => buildedRoute(
						new Request({
							headers: {},
							host: "",
							matchedPath: "",
							method: "",
							origin: "",
							path: "",
							params: {},
							query: {},
							url: "",
							bodyReader: createBodyReader(),
						}),
					),
				);
		});

		const spySend = vi.fn();

		await response.startSendingEvents({ send: spySend } as never);

		expect(spySend).toHaveBeenCalledTimes(2);
		expect(spySend).toHaveBeenNthCalledWith(1, "ping", { value: 2 }, undefined);
		expect(spySend).toHaveBeenNthCalledWith(2, "message", "test2", undefined);
	});

	it("serverSentEventsResponse wrong contract information", async() => {
		const route = useRouteBuilder("GET", "/test", { hooks: [{ afterSendResponse: spyResponse }] })
			.handler(
				ResponseContract.serverSentEvents("good", DPE.string()),
				(floor, { serverSentEventsResponse }) => serverSentEventsResponse("wrongInfo" as any, () => {}),
			);

		const buildedRoute = await useTestRouteFunctionBuilder(route);

		await buildedRoute(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "",
				path: "",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new Response("500", "server-error", new ResponseContract.Error("wrongInfo", "Contract not found.")),
			}),
		);
	});

	it("serverSentEventsResponse wrong contract event and wrong data", async() => {
		const response = await new Promise<ServerSentEventsPredictedResponse>((resolve) => {
			const route = useRouteBuilder("GET", "/test", {
				hooks: [
					{
						afterSendResponse: ({ currentResponse, next }) => {
							void resolve(currentResponse as never);
							return next();
						},
					},
				],
			})
				.handler(
					ResponseContract.serverSentEvents("good", DPE.string(), { theMessage: DPE.number() }),
					(floor, { serverSentEventsResponse }) => serverSentEventsResponse("good", async({ send }) => {
						await send("wrong" as any, "test1");
						await send("theMessage", "test1" as any);
					}),
				);

			void useTestRouteFunctionBuilder(route)
				.then(
					(buildedRoute) => buildedRoute(
						new Request({
							headers: {},
							host: "",
							matchedPath: "",
							method: "",
							origin: "",
							path: "",
							params: {},
							query: {},
							url: "",
							bodyReader: createBodyReader(),
						}),
					),
				);
		});

		const spySend = vi.fn();
		const spyError = vi.spyOn(console, "error");
		spyError.mockImplementation(() => {});
		await expect(response.startSendingEvents({ send: spySend } as never));

		expect(spySend).toHaveBeenCalledTimes(0);
		expect(spyError).toHaveBeenCalledTimes(2);
		expect(spyError).toHaveBeenNthCalledWith(
			1,
			new ResponseContract.Error("good", "Event 'wrong' not found."),
		);
		expect(spyError).toHaveBeenNthCalledWith(
			2,
			new ResponseContract.Error(
				"good",
				expect.objectContaining({ [DP.errorKind.runTimeKey]: null }),
			),
		);
	});

	it("streamResponse from handler", async() => {
		const response = await new Promise<StreamPredictedResponse>((resolve) => {
			const route = useRouteBuilder("GET", "/test", {
				hooks: [
					{
						afterSendResponse: ({ currentResponse, next }) => {
							void resolve(currentResponse as never);
							return next();
						},
					},
				],
			})
				.handler(
					ResponseContract.stream("good", DPE.object({ value: DPE.number() })),
					(floor, { streamResponse }) => streamResponse("good", async({ send }) => {
						await send({ value: 2 });
						await send({ value: 3 });
					}),
				);

			void useTestRouteFunctionBuilder(route)
				.then(
					(buildedRoute) => buildedRoute(
						new Request({
							headers: {},
							host: "",
							matchedPath: "",
							method: "",
							origin: "",
							path: "",
							params: {},
							query: {},
							url: "",
							bodyReader: createBodyReader(),
						}),
					),
				);
		});

		const spySend = vi.fn();

		await response.startStream({ send: spySend } as never);

		expect(spySend).toHaveBeenCalledTimes(2);
		expect(spySend).toHaveBeenNthCalledWith(1, { value: 2 });
		expect(spySend).toHaveBeenNthCalledWith(2, { value: 3 });
	});

	it("streamResponse wrong contract information", async() => {
		const route = useRouteBuilder("GET", "/test", { hooks: [{ afterSendResponse: spyResponse }] })
			.handler(
				ResponseContract.stream("good", DPE.string()),
				(floor, { streamResponse }) => streamResponse("wrongInfo" as any, () => {}),
			);

		const buildedRoute = await useTestRouteFunctionBuilder(route);

		await buildedRoute(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "",
				path: "",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new Response("500", "server-error", new ResponseContract.Error("wrongInfo", "Contract not found.")),
			}),
		);
	});

	it("streamResponse wrong contract data", async() => {
		const response = await new Promise<StreamPredictedResponse>((resolve) => {
			const route = useRouteBuilder("GET", "/test", {
				hooks: [
					{
						afterSendResponse: ({ currentResponse, next }) => {
							void resolve(currentResponse as never);
							return next();
						},
					},
				],
			})
				.handler(
					ResponseContract.stream("good", DPE.number()),
					(floor, { streamResponse }) => streamResponse("good", async({ send }) => {
						await send("wrong" as any);
						await send(2);
					}),
				);

			void useTestRouteFunctionBuilder(route)
				.then(
					(buildedRoute) => buildedRoute(
						new Request({
							headers: {},
							host: "",
							matchedPath: "",
							method: "",
							origin: "",
							path: "",
							params: {},
							query: {},
							url: "",
							bodyReader: createBodyReader(),
						}),
					),
				);
		});

		const spySend = vi.fn();
		const spyError = vi.spyOn(console, "error");
		spyError.mockImplementation(() => {});

		await response.startStream({ send: spySend } as never);

		expect(spySend).toHaveBeenCalledTimes(1);
		expect(spySend).toHaveBeenNthCalledWith(1, 2);
		expect(spyError).toHaveBeenCalledTimes(1);
		expect(spyError).toHaveBeenNthCalledWith(
			1,
			new ResponseContract.Error(
				"good",
				expect.objectContaining({ [DP.errorKind.runTimeKey]: null }),
			),
		);
	});

	it("streamTextResponse from handler", async() => {
		const response = await new Promise<StreamTextPredictedResponse>((resolve) => {
			const route = useRouteBuilder("GET", "/test", {
				hooks: [
					{
						afterSendResponse: ({ currentResponse, next }) => {
							void resolve(currentResponse as never);
							return next();
						},
					},
				],
			})
				.handler(
					ResponseContract.streamText("good"),
					(floor, { streamTextResponse }) => streamTextResponse("good", async({ send }) => {
						await send("test1");
						await send("test2");
					}),
				);

			void useTestRouteFunctionBuilder(route)
				.then(
					(buildedRoute) => buildedRoute(
						new Request({
							headers: {},
							host: "",
							matchedPath: "",
							method: "",
							origin: "",
							path: "",
							params: {},
							query: {},
							url: "",
							bodyReader: createBodyReader(),
						}),
					),
				);
		});

		const spySend = vi.fn();

		await response.startStream({ send: spySend } as never);

		expect(spySend).toHaveBeenCalledTimes(2);
		expect(spySend).toHaveBeenNthCalledWith(1, "test1");
		expect(spySend).toHaveBeenNthCalledWith(2, "test2");
	});

	it("streamTextResponse wrong contract information", async() => {
		const route = useRouteBuilder("GET", "/test", { hooks: [{ afterSendResponse: spyResponse }] })
			.handler(
				ResponseContract.streamText("good"),
				(floor, { streamTextResponse }) => streamTextResponse("wrongInfo" as any, () => {}),
			);

		const buildedRoute = await useTestRouteFunctionBuilder(route);

		await buildedRoute(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "",
				path: "",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new Response("500", "server-error", new ResponseContract.Error("wrongInfo", "Contract not found.")),
			}),
		);
	});
});
