import { BodyParseUnknownError } from "@interfaces-node";

describe("BodyParseUnknownError", () => {
	it("stores content type, unknown error and message", () => {
		const unknownError = new Error("parse failed");
		const error = new BodyParseUnknownError("application/json", unknownError);

		expect({
			...error,
			message: error.message,
		}).toStrictEqual({
			"@duplojs/utils/kind/@DuplojsHttpInterfacesNode/body-parse-unknown-error": null,
			contentType: "application/json",
			unknownError,
			message: "Error when parsing body with 'application/json' content-type.",
		});

		expect(error).toBeInstanceOf(Error);
	});
});
