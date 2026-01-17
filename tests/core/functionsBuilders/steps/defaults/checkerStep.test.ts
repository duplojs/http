import { ResponseContract, useCheckerBuilder, useRouteBuilder, Request, Response, createPresetChecker, PredictedResponse } from "@core";
import { DPE } from "@duplojs/utils";
import { useTestRouteFunctionBuilder } from "@test-utils/useTestRouteFunctionBuilder";

describe("checker step function builder", () => {
	const spyResponse = vi.fn();

	beforeEach(() => {
		spyResponse.mockClear();
	});

	it("response from checker", async() => {
		const checker = useCheckerBuilder()
			.handler(
				(input: string, { output }) => input
					? output("myResult", input.toLowerCase())
					: output("wrongResult", null),
			);

		const route = useRouteBuilder("GET", "/test", { hooks: [{ afterSendResponse: spyResponse }] })
			.extract({ params: { value: DPE.string() } })
			.check(
				checker,
				{
					input: ({ value }) => value,
					result: "myResult",
					otherwise: ResponseContract.notFound("contract.otherwise"),
				},
			)
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
				params: { value: "" },
				query: {},
				url: "",
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse("404", "contract.otherwise", undefined),
			}),
		);
	});

	it("response from handler with body contain checker value", async() => {
		const checker = useCheckerBuilder()
			.handler(
				(input: string, { output }) => input
					? output("myResult", input.toUpperCase())
					: output("wrongResult", null),
			);

		const route = useRouteBuilder("GET", "/test", { hooks: [{ afterSendResponse: spyResponse }] })
			.extract({ params: { value: DPE.string() } })
			.check(
				checker,
				{
					input: ({ value }) => value,
					result: "myResult",
					otherwise: ResponseContract.notFound("contract.otherwise"),
					indexing: "checkerValue",
				},
			)
			.handler(
				ResponseContract.ok("good", DPE.string()),
				({ checkerValue }, { response }) => response("good", checkerValue),
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
				currentResponse: new PredictedResponse("200", "good", "TEST"),
			}),
		);
	});

	it("response from handler with body contain default checker options", async() => {
		const checker = useCheckerBuilder({ options: { option1: "defaultOption1" } })
			.handler(
				(input: string, { output, options }) => input
					? output("myResult", options)
					: output("wrongResult", null),
			);

		const route = useRouteBuilder("GET", "/test", { hooks: [{ afterSendResponse: spyResponse }] })
			.extract({ params: { value: DPE.string() } })
			.check(
				checker,
				{
					input: ({ value }) => value,
					result: "myResult",
					otherwise: ResponseContract.notFound("contract.otherwise"),
					indexing: "checkerValue",
				},
			)
			.handler(
				ResponseContract.ok("good", DPE.string()),
				({ checkerValue }, { response }) => response("good", checkerValue.option1),
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
				currentResponse: new PredictedResponse("200", "good", "defaultOption1"),
			}),
		);
	});

	it("response from handler with body contain checker options", async() => {
		const checker = useCheckerBuilder({ options: { option1: "valueOption1" } })
			.handler(
				(input: string, { output, options }) => input
					? output("myResult", options)
					: output("wrongResult", null),
			);

		const route = useRouteBuilder("GET", "/test", { hooks: [{ afterSendResponse: spyResponse }] })
			.extract({ params: { value: DPE.string() } })
			.check(
				checker,
				{
					input: ({ value }) => value,
					result: "myResult",
					otherwise: ResponseContract.notFound("contract.otherwise"),
					indexing: "checkerValue",
					options: {
						option1: "overrideOption1",
					},
				},
			)
			.handler(
				ResponseContract.ok("good", DPE.string()),
				({ checkerValue }, { response }) => response("good", checkerValue.option1),
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
				currentResponse: new PredictedResponse("200", "good", "overrideOption1"),
			}),
		);
	});

	it("response from handler with body contain checker callback options", async() => {
		const checker = useCheckerBuilder({ options: { option1: "valueOption1" } })
			.handler(
				(input: string, { output, options }) => input
					? output("myResult", options)
					: output("wrongResult", null),
			);

		const route = useRouteBuilder("GET", "/test", { hooks: [{ afterSendResponse: spyResponse }] })
			.extract({ params: { value: DPE.string() } })
			.check(
				checker,
				{
					input: ({ value }) => value,
					result: ["myResult"],
					otherwise: ResponseContract.notFound("contract.otherwise"),
					indexing: "checkerValue",
					options: ({ value }) => ({ option1: value }),
				},
			)
			.handler(
				ResponseContract.ok("good", DPE.string()),
				({ checkerValue }, { response }) => response("good", checkerValue.option1),
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
				currentResponse: new PredictedResponse("200", "good", "test"),
			}),
		);
	});

	it("response from async checker", async() => {
		const checker = useCheckerBuilder()
			.handler(
				(input: string, { output }) => Promise.resolve(
					input
						? output("myResult", input.toLowerCase())
						: output("wrongResult", null),
				),
			);

		const route = useRouteBuilder("GET", "/test", { hooks: [{ afterSendResponse: spyResponse }] })
			.extract({ params: { value: DPE.string() } })
			.check(
				checker,
				{
					input: ({ value }) => value,
					result: "myResult",
					otherwise: ResponseContract.notFound("contract.otherwise"),
				},
			)
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
				params: { value: "test" },
				query: {},
				url: "",
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse("204", "good", undefined),
			}),
		);
	});

	it("passe by presetChecker", async() => {
		const checker = useCheckerBuilder()
			.handler(
				(input: string, { output }) => input
					? output("myResult", input.toLowerCase())
					: output("wrongResult", null),
			);

		const presetChecker = createPresetChecker(
			checker,
			{
				result: "myResult",
				otherwise: ResponseContract.notFound("contract.otherwise"),
			},
		);

		const route = useRouteBuilder("GET", "/test", { hooks: [{ afterSendResponse: spyResponse }] })
			.extract({ params: { value: DPE.string() } })
			.presetCheck(
				presetChecker,
				({ value }) => value,
			)
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
				params: { value: "" },
				query: {},
				url: "",
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse("404", "contract.otherwise", undefined),
			}),
		);
	});
});
