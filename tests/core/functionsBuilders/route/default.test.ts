import { ResponseContract, useRouteBuilder, Request, Response, usePreflightBuilder, useProcessBuilder, defaultExtractStepFunctionBuilder, defaultHandlerStepFunctionBuilder, HookResponse, type HookRouteLifeCycle, PredictedResponse } from "@core";
import { DPE } from "@duplojs/utils";
import { createBodyReader } from "@test-utils/bodyReader";
import { useTestRouteFunctionBuilder } from "@test-utils/useTestRouteFunctionBuilder";

describe("route function builder", () => {
	const spyResponse = vi.fn();

	beforeEach(() => {
		spyResponse.mockClear();
	});

	it("failed build step", async() => {
		const route = useRouteBuilder("GET", "/test", { hooks: [{ afterSendResponse: spyResponse }] })
			.extract({ params: { value: DPE.string() } })
			.handler(
				ResponseContract.ok("good", DPE.string()),
				(floor, { response }) => response("good", floor.value),
			);

		await expect(useTestRouteFunctionBuilder(route, { stepFunctionBuilders: [] }))
			.rejects.toThrowError();
	});

	it("failed build preflight step", async() => {
		const process = useProcessBuilder()
			.exports();

		const route = usePreflightBuilder()
			.exec(process)
			.useRouteBuilder("GET", "/test", { hooks: [{ afterSendResponse: spyResponse }] })
			.extract({ params: { value: DPE.string() } })
			.handler(
				ResponseContract.ok("good", DPE.string()),
				(floor, { response }) => response("good", floor.value),
			);

		await expect(
			useTestRouteFunctionBuilder(route, {
				stepFunctionBuilders: [defaultExtractStepFunctionBuilder, defaultHandlerStepFunctionBuilder],
			}),
		)
			.rejects.toThrowError();
	});

	it("route send response", async() => {
		const process = useProcessBuilder()
			.exports();

		const route = usePreflightBuilder()
			.exec(process)
			.useRouteBuilder("GET", "/test", { hooks: [{ afterSendResponse: spyResponse }] })
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

	it("route preflight send response", async() => {
		const process = useProcessBuilder()
			.cut(
				ResponseContract.badRequest("preflight"),
				(floor, { response }) => response("preflight"),
			)
			.exports();

		const route = usePreflightBuilder()
			.exec(process)
			.useRouteBuilder("GET", "/test", { hooks: [{ afterSendResponse: spyResponse }] })
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
				currentResponse: new PredictedResponse("400", "preflight", undefined),
			}),
		);
	});

	it("route default response", async() => {
		const route = useRouteBuilder("GET", "/test", { hooks: [{ afterSendResponse: spyResponse }] })
			.extract({ params: { value: DPE.string() } })
			.handler(
				ResponseContract.ok("good", DPE.string()),
				(floor, { response }) => ({}) as never,
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
				currentResponse: new Response("500", "missing-response", undefined),
			}),
		);
	});

	describe("test hooks", () => {
		it("onConstructRequest ", async() => {
			const route = useRouteBuilder("GET", "/test", {
				hooks: [
					{
						afterSendResponse: spyResponse,
						onConstructRequest: ({ addRequestProperties }) => addRequestProperties({
							myProps: "superValueAddOnHooks",
						}),
					},
				],
			})
				.handler(
					ResponseContract.ok("good", DPE.string()),
					(floor, { response, request }) => response("good", request.myProps),
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
					params: { },
					query: {},
					url: "",
					bodyReader: createBodyReader(),
				}),
			);

			expect(spyResponse).toHaveBeenCalledWith(
				expect.objectContaining({
					currentResponse: new PredictedResponse("200", "good", "superValueAddOnHooks"),
				}),
			);
		});

		it("beforeRouteExecution ", async() => {
			const route = useRouteBuilder("GET", "/test", {
				hooks: [
					{
						afterSendResponse: spyResponse,
						beforeRouteExecution: ({ response }) => response("400", "info"),
					},
				],
			})
				.handler(
					ResponseContract.noContent("good"),
					(floor, { response }) => response("good"),
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
					params: { },
					query: {},
					url: "",
					bodyReader: createBodyReader(),
				}),
			);

			expect(spyResponse).toHaveBeenCalledWith(
				expect.objectContaining({
					currentResponse: new HookResponse("beforeRouteExecution", "400", "info", undefined),
				}),
			);
		});

		it("error", async() => {
			const route = useRouteBuilder("GET", "/test", {
				hooks: [
					{
						afterSendResponse: spyResponse,
						error: ({ response }) => response("400", "info"),
					},
				],
			})
				.handler(
					ResponseContract.noContent("good"),
					(floor, { response }) => {
						throw new Error("test");
					},
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
					params: { },
					query: {},
					url: "",
					bodyReader: createBodyReader(),
				}),
			);

			expect(spyResponse).toHaveBeenCalledWith(
				expect.objectContaining({
					currentResponse: new HookResponse("error", "400", "info", undefined),
				}),
			);
		});

		it("default error", async() => {
			const route = useRouteBuilder("GET", "/test", {
				hooks: [
					{
						beforeRouteExecution: ({ next }) => next(),
						afterSendResponse: spyResponse,
						sendResponse: ({ exit }) => exit(),
						error: ({ next }) => next(),
					},
				],
			})
				.handler(
					ResponseContract.noContent("good"),
					(floor, { response }) => {
						throw new Error("test");
					},
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
					params: { },
					query: {},
					url: "",
					bodyReader: createBodyReader(),
				}),
			);

			expect(spyResponse).toHaveBeenCalledWith(
				expect.objectContaining({
					currentResponse: new Response("500", "server-error", new Error("test")),
				}),
			);
		});

		it("order exec hook", async() => {
			const checkpoint: string[] = [];

			function createCheckpointHook(value: string): HookRouteLifeCycle {
				return {
					afterSendResponse: ({ next }) => {
						checkpoint.push(`afterSendResponse ${value}`);
						return next();
					},
					beforeRouteExecution: ({ next }) => {
						checkpoint.push(`beforeRouteExecution ${value}`);
						return next();
					},
					beforeSendResponse: ({ next }) => {
						checkpoint.push(`beforeSendResponse ${value}`);
						return next();
					},
					error: ({ next }) => {
						checkpoint.push(`error ${value}`);
						return next();
					},
					onConstructRequest: ({ request }) => {
						checkpoint.push(`onConstructRequest ${value}`);
						return request;
					},
					sendResponse: ({ next }) => {
						checkpoint.push(`sendResponse ${value}`);
						return next();
					},
				};
			}

			const route = usePreflightBuilder({ hooks: [createCheckpointHook("builder preflight process")] })
				.exec(
					useProcessBuilder({ hooks: [createCheckpointHook("preflight process")] })
						.exec(
							useProcessBuilder({ hooks: [createCheckpointHook("preflight deep process")] })
								.exports(),
						)
						.exports(),
				)
				.useRouteBuilder("GET", "/", { hooks: [createCheckpointHook("route")] })
				.exec(
					useProcessBuilder({ hooks: [createCheckpointHook("process")] })
						.exec(
							useProcessBuilder({ hooks: [createCheckpointHook("deep process")] })
								.exports(),
						)
						.exports(),
				)
				.handler(
					ResponseContract.noContent("ok"),
					(floor, { response }) => response("ok"),
				);

			const buildedRoute = await useTestRouteFunctionBuilder(route, {
				globalHooksRouteLifeCycle: [createCheckpointHook("global")],
			});

			await buildedRoute(
				new Request({
					headers: {},
					host: "",
					matchedPath: "",
					method: "",
					origin: "",
					path: "",
					params: { },
					query: {},
					url: "",
					bodyReader: createBodyReader(),
				}),
			);

			expect(checkpoint).toStrictEqual([
				"onConstructRequest route",
				"onConstructRequest builder preflight process",
				"onConstructRequest preflight process",
				"onConstructRequest preflight deep process",
				"onConstructRequest process",
				"onConstructRequest deep process",
				"onConstructRequest global",

				"beforeRouteExecution route",
				"beforeRouteExecution builder preflight process",
				"beforeRouteExecution preflight process",
				"beforeRouteExecution preflight deep process",
				"beforeRouteExecution process",
				"beforeRouteExecution deep process",
				"beforeRouteExecution global",

				"beforeSendResponse route",
				"beforeSendResponse builder preflight process",
				"beforeSendResponse preflight process",
				"beforeSendResponse preflight deep process",
				"beforeSendResponse process",
				"beforeSendResponse deep process",
				"beforeSendResponse global",

				"sendResponse route",
				"sendResponse builder preflight process",
				"sendResponse preflight process",
				"sendResponse preflight deep process",
				"sendResponse process",
				"sendResponse deep process",
				"sendResponse global",

				"afterSendResponse route",
				"afterSendResponse builder preflight process",
				"afterSendResponse preflight process",
				"afterSendResponse preflight deep process",
				"afterSendResponse process",
				"afterSendResponse deep process",
				"afterSendResponse global",
			]);
		});
	});
});
