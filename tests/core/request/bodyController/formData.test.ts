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
			maxBufferSize: 131072,
			maxIndexArray: 500,
			maxKeyLength: 500,
			mimeType: /^test$/,
		});

	expect(
		controlBodyAsFormData({
			maxFileQuantity: 10,
			bodyMaxSize: "50b",
			fileMaxSize: "50b",
			mimeType: "test",
			maxBufferSize: "10kb",
			maxIndexArray: 50,
			maxKeyLength: 1,
		}).params,
	)
		.toStrictEqual({
			maxFileQuantity: 10,
			bodyMaxSize: 50,
			fileMaxSize: 50,
			maxBufferSize: 10240,
			maxIndexArray: 50,
			maxKeyLength: 1,
			mimeType: /^test$/,
		});
});
