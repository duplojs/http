import { controlBodyAsText, TextBodyController } from "@core";

it("controlBodyAsText", () => {
	expect(TextBodyController.is(controlBodyAsText()))
		.toStrictEqual(true);

	expect(controlBodyAsText({ bodyMaxSize: "10mb" }).params)
		.toStrictEqual({ bodyMaxSize: 10485760 });
});
