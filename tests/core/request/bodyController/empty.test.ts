import { controlBodyAsEmpty, EmptyBodyController } from "@core";

it("controlBodyAsEmpty", () => {
	expect(EmptyBodyController.is(controlBodyAsEmpty()))
		.toStrictEqual(true);
});
