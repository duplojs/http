import { makeOpenApiPage, makeOpenApiRoute } from "@plugin-openApiGenerator";
import { useTestRouteFunctionBuilder } from "@test-utils/useTestRouteFunctionBuilder";
import { PredictedResponse, Request, Response } from "@core";

describe("makeOpenApiRoute", () => {
	const spyResponse = vi.fn();

	beforeEach(() => {
		spyResponse.mockClear();
	});

	const openApiPage = makeOpenApiPage({
		openApiDocument: JSON.stringify(
			{
				openapi: "3.1.0",
				info: {
					title: "Swagger",
					version: "0.0.0",
				},
			},
		),
		pageTitle: "Swagger",
		swaggerUiVersion: "5.31.0",
	});

	it("expect good result", async() => {
		const route = makeOpenApiRoute(
			"/swagger",
			openApiPage,
		);

		const buildedRoute = await useTestRouteFunctionBuilder(
			route,
			{
				globalHooksRouteLifeCycle: [{ afterSendResponse: spyResponse }],
			},
		);

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
			}),
		);

		expect(spyResponse).toHaveBeenCalledWith(
			expect.objectContaining({
				currentResponse: new PredictedResponse("200", "swaggerUi", openApiPage)
					.setHeader("content-type", "text/html"),
			}),
		);
	});
});
