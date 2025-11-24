import { ResponseContract, useProcessBuilder, useRouteBuilder, Request, Response, defaultHandlerStepFunctionBuilder, defaultProcessStepFunctionBuilder } from "@core";
import { DPE } from "@duplojs/utils";
import { useTestRouteFunctionBuilder } from "@test-utils/useTestRouteFunctionBuilder";

describe("process function builder", () => {
	const spyResponse = vi.fn();

	beforeEach(() => {
		spyResponse.mockClear();
	});

	it("build step not support", async() => {
		const process = useProcessBuilder()
			.extract({ origin: DPE.number() })
			.exports(["origin"]);

		const route = useRouteBuilder("GET", "/users", { hooks: [{ afterSendResponse: spyResponse }] })
			.exec(process, { imports: ["origin"] })
			.handler(
				ResponseContract.ok("good", DPE.number()),
				(floor, { response }) => response("good", floor.origin),
			);

		await expect(
			useTestRouteFunctionBuilder(route, {
				stepFunctionBuilders: [
					defaultHandlerStepFunctionBuilder,
					defaultProcessStepFunctionBuilder,
				],
			}),
		).rejects.toThrowError();
	});

	it("response from process", async() => {
		const process = useProcessBuilder()
			.extract({ origin: DPE.number() })
			.exports(["origin"]);

		const route = useRouteBuilder("GET", "/users", { hooks: [{ afterSendResponse: spyResponse }] })
			.exec(process, { imports: ["origin"] })
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
				origin: "test",
				path: "",
				params: {},
				query: {},
				url: "",
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new Response("422", "extract-error", expect.any(Object))
					.setHeader("extract-key", "request.origin"),
			}),
		);
	});

	it("route pickup process value", async() => {
		const process = useProcessBuilder()
			.extract({ origin: DPE.string() })
			.exports(["origin"]);

		const route = useRouteBuilder("GET", "/users", { hooks: [{ afterSendResponse: spyResponse }] })
			.exec(process, { imports: ["origin"] })
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
				origin: "myOrigin",
				path: "",
				params: {},
				query: {},
				url: "",
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new Response("200", "good", "myOrigin"),
			}),
		);
	});

	it("route pickup process value", async() => {
		const process = useProcessBuilder()
			.extract({ origin: DPE.string() })
			.exports(["origin"]);

		const route = useRouteBuilder("GET", "/users", { hooks: [{ afterSendResponse: spyResponse }] })
			.exec(process)
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
				origin: "myOrigin",
				path: "",
				params: {},
				query: {},
				url: "",
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new Response("204", "good", undefined),
			}),
		);
	});
});
