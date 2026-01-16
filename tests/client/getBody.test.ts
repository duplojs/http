import { getBody } from "@client";

describe("getBody", () => {
	it("returns undefined when content-type is missing", async() => {
		const response = {
			headers: new Headers(),
		} as Response;

		await expect(getBody(response)).resolves.toBeUndefined();
	});

	it("parses json when content-type includes json", async() => {
		const json = vi.fn().mockResolvedValue({ ok: true });
		const response = {
			headers: new Headers({ "content-type": "application/json; charset=utf-8" }),
			json,
		} as unknown as Response;

		await expect(getBody(response)).resolves.toStrictEqual({ ok: true });
		expect(json).toHaveBeenCalledTimes(1);
	});

	it("parses text when content-type includes text", async() => {
		const text = vi.fn().mockResolvedValue("hello");
		const response = {
			headers: new Headers({ "content-type": "text/plain" }),
			text,
		} as unknown as Response;

		await expect(getBody(response)).resolves.toBe("hello");
		expect(text).toHaveBeenCalledTimes(1);
	});

	it("parses form-data when content-type includes form-data", async() => {
		const formData = vi.fn().mockResolvedValue({ field: "value" });
		const response = {
			headers: new Headers({ "content-type": "multipart/form-data" }),
			formData,
		} as unknown as Response;

		await expect(getBody(response)).resolves.toStrictEqual({ field: "value" });
		expect(formData).toHaveBeenCalledTimes(1);
	});

	it("parses blob for other content-types", async() => {
		const blob = vi.fn().mockResolvedValue(new Blob(["data"]));
		const response = {
			headers: new Headers({ "content-type": "application/octet-stream" }),
			blob,
		} as unknown as Response;

		await expect(getBody(response)).resolves.toBeInstanceOf(Blob);
		expect(blob).toHaveBeenCalledTimes(1);
	});
});
