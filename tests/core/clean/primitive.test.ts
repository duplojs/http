import "@core";
import { C, type DPE, E, type ExpectType, asserts } from "@duplojs/utils";

describe("primitive", () => {
	it("toExtractParser", () => {
		const parser = C.String.toExtractParser();

		asserts(parser.parse("hello"), E.isRight);
		asserts(parser.parse(""), E.isRight);
		asserts(parser.parse(10), E.isLeft);

		expect(parser.parseOrThrow("test")).toStrictEqual(C.String.createOrThrow("test"));

		type Check = ExpectType<
			DPE.Output<typeof parser>,
			C.Primitive<string>,
			"strict"
		>;
	});

	it("toEndpointSchema", () => {
		const parser = C.String.toEndpointSchema();

		asserts(parser.parse("hello"), E.isRight);
		asserts(parser.parse(""), E.isRight);
		asserts(parser.parse(10), E.isLeft);

		expect(parser.parseOrThrow("test")).toBe("test");

		type Check = ExpectType<
			DPE.Output<typeof parser>,
			string,
			"strict"
		>;
	});
});
