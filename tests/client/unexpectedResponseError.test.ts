import {
	UnexpectedInformationResponseError,
	UnexpectedCodeResponseError,
	UnexpectedResponseTypeError,
	UnexpectedResponseError,
	type ErrorContent,
	type ClientRequestParams,
	type ClientResponse,
} from "@client";

describe("unexpected response errors", () => {
	const requestParams = {
		method: "GET",
		path: "/",
	} as ClientRequestParams;
	const errorContent: ErrorContent = {
		error: new Error("boom"),
		requestParams,
	};
	const response = {
		code: "200",
		information: undefined,
		body: null,
		ok: true,
		headers: new Headers(),
		type: "basic" as ResponseType,
		url: "https://example.com",
		redirected: false,
		raw: {} as Response,
		requestParams,
	} as ClientResponse;

	it("builds UnexpectedInformationResponseError", () => {
		const instance = new UnexpectedInformationResponseError("info", response);

		expect(instance).toBeInstanceOf(Error);
		expect(instance.information).toBe("info");
		expect(instance.response).toBe(response);
	});

	it("builds UnexpectedCodeResponseError", () => {
		const instance = new UnexpectedCodeResponseError(["404", "500"], response);

		expect(instance).toBeInstanceOf(Error);
		expect(instance.code).toStrictEqual(["404", "500"]);
		expect(instance.response).toBe(response);
	});

	it("builds UnexpectedResponseTypeError", () => {
		const instance = new UnexpectedResponseTypeError("clientError", response);

		expect(instance).toBeInstanceOf(Error);
		expect(instance.expectType).toBe("clientError");
		expect(instance.response).toBe(response);
	});

	it("builds UnexpectedResponseError", () => {
		const instance = new UnexpectedResponseError(errorContent);

		expect(instance).toBeInstanceOf(Error);
		expect(instance.response).toBe(errorContent);
	});
});
