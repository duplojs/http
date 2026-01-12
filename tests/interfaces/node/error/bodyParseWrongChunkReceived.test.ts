import { BodyParseWrongChunkReceived } from "@interface-node";

describe("BodyParseWrongChunkReceived", () => {
	it("stores wrong chunk and message", () => {
		const chunk = { some: "value" };
		const error = new BodyParseWrongChunkReceived(chunk);

		expect({
			...error,
			message: error.message,
		}).toStrictEqual({
			"@duplojs/utils/kind/@DuplojsHttpInterfacesNode/body-parse-wrong-chunk-received": null,
			wrongChunk: chunk,
			message: "Received chunk is not buffer or string.",
		});

		expect(error).toBeInstanceOf(Error);
	});
});
