import { ResponseContract, useRouteBuilder, Request, PredictedResponse } from "@core";
import { DP, DPE } from "@duplojs/utils";
import { createBodyReader } from "@test-utils/bodyReader";
import { useTestRouteFunctionBuilder } from "@test-utils/useTestRouteFunctionBuilder";

describe("extract step function builder", () => {
	const spyResponse = vi.fn();

	beforeEach(() => {
		spyResponse.mockClear();
	});

	it("sub extract value from params", async() => {
		const route = useRouteBuilder("GET", "/test", { hooks: [{ afterSendResponse: spyResponse }] })
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

	it("extract value from origin", async() => {
		const route = useRouteBuilder("GET", "/test", { hooks: [{ afterSendResponse: spyResponse }] })
			.extract({ origin: DPE.string() })
			.handler(
				ResponseContract.ok("good", DPE.string()),
				(floor, { response }) => response("good", floor.origin),
			);

		const buildedRoute = await useTestRouteFunctionBuilder(route);

		await buildedRoute(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "test1",
				path: "",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse("200", "good", "test1"),
			}),
		);
	});

	it("error extract dev", async() => {
		const route = useRouteBuilder("GET", "/test", { hooks: [{ afterSendResponse: spyResponse }] })
			.extract({ origin: DPE.number() })
			.handler(
				ResponseContract.ok("good", DPE.number()),
				(floor, { response }) => response("good", floor.origin),
			);

		const buildedRoute = await useTestRouteFunctionBuilder(route);

		await buildedRoute(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "test1",
				path: "",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse(
					"422",
					"extract-error",
					expect.objectContaining({ [DP.errorKind.runTimeKey]: null }),
				)
					.setHeader("extract-key", "request.origin"),
			}),
		);
	});

	it("error sub extract", async() => {
		const route = useRouteBuilder("GET", "/test", { hooks: [{ afterSendResponse: spyResponse }] })
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
				origin: "test1",
				path: "",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse(
					"422",
					"extract-error",
					expect.objectContaining({ [DP.errorKind.runTimeKey]: null }),
				)
					.setHeader("extract-key", "request.params.value"),
			}),
		);
	});

	it("error extract prod", async() => {
		const route = useRouteBuilder("GET", "/test", { hooks: [{ afterSendResponse: spyResponse }] })
			.extract({ origin: DPE.number() })
			.handler(
				ResponseContract.ok("good", DPE.number()),
				(floor, { response }) => response("good", floor.origin),
			);

		const buildedRoute = await useTestRouteFunctionBuilder(route, { environment: "PROD" });

		await buildedRoute(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "test1",
				path: "",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse(
					"422",
					"extract-error",
					undefined,
				)
					.setHeader("extract-key", "request.origin"),
			}),
		);
	});

	it("custom error extract", async() => {
		const route = useRouteBuilder("GET", "/test", { hooks: [{ afterSendResponse: spyResponse }] })
			.extract({ origin: DPE.number() }, ResponseContract.badRequest("test-custom"))
			.handler(
				ResponseContract.ok("good", DPE.number()),
				(floor, { response }) => response("good", floor.origin),
			);

		const buildedRoute = await useTestRouteFunctionBuilder(route, { environment: "PROD" });

		await buildedRoute(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "test1",
				path: "",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse(
					"400",
					"test-custom",
					undefined,
				)
					.setHeader("extract-key", "request.origin"),
			}),
		);
	});

	it("extract body", async() => {
		const route = useRouteBuilder("GET", "/test", { hooks: [{ afterSendResponse: spyResponse }] })
			.extract({ body: DPE.number() })
			.handler(
				ResponseContract.ok("good", DPE.number()),
				(floor, { response }) => response("good", floor.body),
			);

		const buildedRoute = await useTestRouteFunctionBuilder(route, { environment: "PROD" });

		await buildedRoute(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "test1",
				path: "",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(() => 12),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse(
					"200",
					"good",
					12,
				),
			}),
		);
	});

	it("extract body whit async schema", async() => {
		const route = useRouteBuilder("GET", "/test", { hooks: [{ afterSendResponse: spyResponse }] })
			.extract({ body: DPE.number().transform(async(value) => Promise.resolve(value + 1)) })
			.handler(
				ResponseContract.ok("good", DPE.number()),
				(floor, { response }) => response("good", floor.body),
			);

		const buildedRoute = await useTestRouteFunctionBuilder(route, { environment: "DEV" });

		await buildedRoute(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "test1",
				path: "",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(() => 1),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse(
					"200",
					"good",
					2,
				),
			}),
		);
	});

	it("fail extract body", async() => {
		const route = useRouteBuilder("GET", "/test", { hooks: [{ afterSendResponse: spyResponse }] })
			.extract({ body: DPE.number() })
			.handler(
				ResponseContract.ok("good", DPE.number()),
				(floor, { response }) => response("good", floor.body),
			);

		const buildedRoute = await useTestRouteFunctionBuilder(route, { environment: "DEV" });

		await buildedRoute(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "test1",
				path: "",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(() => new Error("fail")),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse(
					"422",
					"extract-error",
					new Error("fail"),
				)
					.setHeader("extract-key", "request.body"),
			}),
		);
	});

	it("extract with async dataParser", async() => {
		const route = useRouteBuilder("GET", "/test", { hooks: [{ afterSendResponse: spyResponse }] })
			.extract({ origin: DPE.string().transform(async(value) => Promise.resolve(`${value}tt`)) })
			.handler(
				ResponseContract.ok("good", DPE.string()),
				(floor, { response }) => response("good", floor.origin),
			);

		const buildedRoute = await useTestRouteFunctionBuilder(route);

		await buildedRoute(
			new Request({
				headers: {},
				host: "",
				matchedPath: "",
				method: "",
				origin: "test1",
				path: "",
				params: {},
				query: {},
				url: "",
				bodyReader: createBodyReader(),
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse("200", "good", "test1tt"),
			}),
		);
	});
});
