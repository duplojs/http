import { Response } from "@core/response";
import { allowMethodsFunction } from "@plugin-cors/headerFunctions";
import { type RequestInitializationData, Request } from "@core";
import { createBodyReader } from "@test-utils/bodyReader";

function createTestRequest(
	input: Partial<RequestInitializationData> = {},
) {
	return new Request({
		method: "OPTIONS",
		headers: {},
		url: "https://example.com/test",
		host: "example.com",
		origin: "https://example.com",
		matchedPath: null,
		params: {},
		path: "/test",
		query: {},
		bodyReader: createBodyReader(),
		...input,
	});
}

function createTestResponse() {
	return new Response("204", "cors", undefined);
}

describe("allowMethodsFunction", () => {
	it("sets the allow methods header with the default value", () => {
		const response = createTestResponse();

		allowMethodsFunction.default("GET,POST")(createTestRequest(), response);

		expect(response.headers!["Access-Control-Allow-Methods"]).toStrictEqual("GET,POST");
	});

	it("sets the allow methods header from the request path when matchedPath is set", () => {
		const response = createTestResponse();

		allowMethodsFunction.isBool({
			"/test": "GET,POST,PUT",
		})(createTestRequest(), response);

		expect(response.headers!["Access-Control-Allow-Methods"]).toStrictEqual("GET,POST,PUT");
	});
});
