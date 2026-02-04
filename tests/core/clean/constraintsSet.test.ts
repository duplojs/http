import "@core";
import { C, type DPE, E, type ExpectType, asserts } from "@duplojs/utils";

describe("constraintsSet", () => {
	it("toExtractParser", () => {
		const constraints = C.createConstraintsSet(
			C.Number,
			[C.NumberMin(10), C.NumberMax(20)],
		);
		const parser = constraints.toExtractParser();

		asserts(parser.parse(15), E.isRight);
		asserts(parser.parse(1), E.isLeft);
		asserts(parser.parse(25), E.isLeft);

		expect(parser.parseOrThrow(12)).toStrictEqual(constraints.createOrThrow(12));

		type Check = ExpectType<
			DPE.Output<typeof parser>,
			C.Primitive<number>
			& C.ConstrainedType<"number-min-10", number>
			& C.ConstrainedType<"number-max-20", number>,
			"strict"
		>;
	});

	it("toEndpointSchema", () => {
		const constraints = C.createConstraintsSet(
			C.Number,
			[C.NumberMin(10), C.NumberMax(20)],
		);
		const parser = constraints.toEndpointSchema();

		asserts(parser.parse(15), E.isRight);
		asserts(parser.parse(1), E.isLeft);
		asserts(parser.parse(25), E.isLeft);

		expect(parser.parseOrThrow(12)).toStrictEqual(12);

		type Check = ExpectType<
			DPE.Output<typeof parser>,
			number,
			"strict"
		>;
	});
});
