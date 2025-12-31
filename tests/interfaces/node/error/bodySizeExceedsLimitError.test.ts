import { BodySizeExceedsLimitError } from "@interface-node";

describe("BodySizeExceedsLimitError", () => {
	it("stores size and message", () => {
		const error = new BodySizeExceedsLimitError(1024);

		expect({
			...error,
			message: error.message,
		}).toStrictEqual({
			"@duplojs/utils/kind/@DuplojsHttpInterfacesNode/body-size-exceeds-limit-error": null,
			bytesInString: 1024,
			message: "Body size is bigger than 1024.",
		});

		expect(error).toBeInstanceOf(Error);
	});
});
