import { controlBodyAsText } from "@core";

it("controlBodyAsText", () => {
	expect(controlBodyAsText({ bodyMaxSize: "10mb" }).params)
		.toStrictEqual({ bodyMaxSize: 10485760 });
});
