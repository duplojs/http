import "@core";
import { C, DP, type DPE, E, type ExpectType, asserts } from "@duplojs/utils";

describe("constraint", () => {
	it("toExtractParser", () => {
		const positive = C.createConstraint(
			"positive",
			C.Number,
			DP.checkerNumberMin(1),
		);
		const parser = positive.toExtractParser();

		asserts(parser.parse(20050), E.isRight);
		asserts(parser.parse(1), E.isRight);
		asserts(parser.parse(0), E.isLeft);
		asserts(parser.parse(-20050), E.isLeft);

		expect(parser.parseOrThrow(10)).toStrictEqual(positive.createOrThrow(10));

		type Check = ExpectType<
			DPE.Output<typeof parser>,
			C.ConstrainedType<"positive", number>,
			"strict"
		>;
	});

	it("toEndpointSchema", () => {
		const positive = C.createConstraint(
			"positive",
			C.Number,
			DP.checkerNumberMin(1),
		);
		const parser = positive.toEndpointSchema();

		asserts(parser.parse(20050), E.isRight);
		asserts(parser.parse(1), E.isRight);
		asserts(parser.parse(0), E.isLeft);
		asserts(parser.parse(-20050), E.isLeft);

		expect(parser.parseOrThrow(10)).toBe(10);

		type Check = ExpectType<
			DPE.Output<typeof parser>,
			number,
			"strict"
		>;
	});
});
