import { ResponseContract, useRouteBuilder, Request, Response, usePreflightBuilder, useProcessBuilder, defaultExtractStepFunctionBuilder, defaultHandlerStepFunctionBuilder, HookResponse } from "@core";
import { DPE } from "@duplojs/utils";
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
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new Response("200", "good", "test"),
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
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new Response("400", "preflight", undefined),
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
				}),
			);

			expect(spyResponse).toHaveBeenCalledWith(
				expect.objectContaining({
					currentResponse: new Response("200", "good", "superValueAddOnHooks"),
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
				}),
			);

			expect(spyResponse).toHaveBeenCalledWith(
				expect.objectContaining({
					currentResponse: new HookResponse("beforeRouteExecution", "400", "info", undefined),
				}),
			);
		});

		it("parseBody", async() => {
			const route = useRouteBuilder("GET", "/test", {
				hooks: [
					{
						afterSendResponse: spyResponse,
						parseBody: ({ response }) => response("400", "info"),
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
				}),
			);

			expect(spyResponse).toHaveBeenCalledWith(
				expect.objectContaining({
					currentResponse: new HookResponse("parseBody", "400", "info", undefined),
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
						parseBody: ({ next }) => next(),
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
				}),
			);

			expect(spyResponse).toHaveBeenCalledWith(
				expect.objectContaining({
					currentResponse: new Response("500", "server-error", new Error("test")),
				}),
			);
		});
	});
});
