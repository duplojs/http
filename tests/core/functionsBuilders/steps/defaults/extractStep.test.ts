import { ResponseContract, useRouteBuilder, Request, Response } from "@core";
import { DP, DPE } from "@duplojs/utils";
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
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new Response("200", "good", "test"),
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
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new Response("200", "good", "test1"),
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
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new Response(
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
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new Response(
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
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new Response(
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
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new Response(
					"400",
					"test-custom",
					undefined,
				)
					.setHeader("extract-key", "request.origin"),
			}),
		);
	});
});
