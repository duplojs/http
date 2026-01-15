import { makeOpenApiPage } from "@plugin-openApiGenerator";

describe("makeOpenApiPage", () => {
	const openApiDocument = {
		openapi: "3.1.0",
		info: {
			title: "Swagger",
			version: "0.0.0",
		},
	};

	it("expect good result", () => {
		const result = makeOpenApiPage({
			openApiDocument: JSON.stringify(openApiDocument),
			pageTitle: "Swagger",
			swaggerUiVersion: "5.31.0",
		});

		expect(result).toMatchSnapshot();
	});
});
