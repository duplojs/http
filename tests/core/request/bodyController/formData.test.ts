import { controlBodyAsFormData } from "@core";

it("controlBodyAsFormData", () => {
	expect(
		controlBodyAsFormData({
			maxFileQuantity: 10,
			bodyMaxSize: "50b",
			fileMaxSize: "50b",
			mimeType: "test",
		}).params,
	)
		.toStrictEqual({
			maxFileQuantity: 10,
			bodyMaxSize: 50,
			fileMaxSize: 50,
			mimeType: /^test$/,
		});
});
