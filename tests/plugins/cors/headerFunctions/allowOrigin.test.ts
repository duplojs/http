import { Response } from "@core/response";
import { allowOriginFunction } from "@plugin-cors/headerFunctions";
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

describe("allowOriginFunction", () => {
	it("set allow origin header when regexp matches", () => {
		const response = createTestResponse();
		const request = createTestRequest({
			origin: "https://api.example.com",
		});

		allowOriginFunction.default(/^https:\/\/api\.example\.com$/)(request, response);

		expect(response.headers!["access-control-allow-origin"]).toStrictEqual("https://api.example.com");
	});

	it("does not set allow origin header when regexp does not match", () => {
		const response = createTestResponse();

		allowOriginFunction.default(/^https:\/\/api\.example\.com$/)(createTestRequest(), response);

		expect(response.headers?.["access-control-allow-origin"]).toBeUndefined();
	});

	it("set allow origin header when async function returns true", async() => {
		const response = createTestResponse();
		const request = createTestRequest({
			origin: "https://app.example.com",
		});

		await allowOriginFunction.isFunction((origin) => origin === "https://app.example.com")(request, response);

		expect(response.headers!["access-control-allow-origin"]).toStrictEqual("https://app.example.com");
	});

	it("does not set allow origin header when async function returns false", async() => {
		const response = createTestResponse();

		await allowOriginFunction.isFunction(() => Promise.resolve(false))(createTestRequest(), response);

		expect(response.headers?.["access-control-allow-origin"]).toBeUndefined();
	});
});
