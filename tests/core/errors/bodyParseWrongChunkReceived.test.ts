import { BodyParseWrongChunkReceived } from "@core";

it("BodyParseWrongChunkReceived", () => {
	expect(new BodyParseWrongChunkReceived("test", 1212)).instanceOf(Error);
});
