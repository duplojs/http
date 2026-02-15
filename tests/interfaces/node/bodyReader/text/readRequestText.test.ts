import { BodyParseWrongChunkReceived, BodySizeExceedsLimitError } from "@core/errors";
import { readRequestText } from "@interface-node/bodyReaders/text/readRequestText";
import { E, unwrap } from "@duplojs/utils";
import { createFakeRequest } from "@test-utils/request";

describe("readRequestText", () => {
	it("reads buffer and string chunks", async() => {
		const request = createFakeRequest({
			raw: {
				request: {
					bodyChunks: [Buffer.from("hello "), "world"],
				},
			},
		});
		const destroySpy = vi.spyOn(request.raw.request, "destroy");

		const result = await readRequestText(request.raw.request, { maxBodySize: 100 });

		expect(result).toBe("hello world");
		expect(destroySpy).toHaveBeenCalled();
	});

	it("uses onEnd and returns its result", async() => {
		const request = createFakeRequest({
			raw: {
				request: {
					bodyChunks: ["duplo"],
				},
			},
		});
		const destroySpy = vi.spyOn(request.raw.request, "destroy");
		const onEnd = vi.fn((value: string) => ({
			ok: true,
			value,
		}));

		const result = await readRequestText(request.raw.request, { maxBodySize: 100 }, onEnd);

		expect(onEnd).toHaveBeenCalledWith("duplo");
		expect(result).toStrictEqual({
			ok: true,
			value: "duplo",
		});
		expect(destroySpy).toHaveBeenCalled();
	});

	it("returns error for wrong chunk type", async() => {
		const request = createFakeRequest({
			raw: {
				request: {
					bodyChunks: [123],
				},
			},
		});
		const destroySpy = vi.spyOn(request.raw.request, "destroy");

		const result = await readRequestText(request.raw.request, { maxBodySize: 100 });

		expect(E.hasInformation(result, "error")).toBe(true);
		expect(unwrap(result)).toBeInstanceOf(BodyParseWrongChunkReceived);
		expect(destroySpy).toHaveBeenCalled();
	});

	it("returns error when body size exceeds limit", async() => {
		const request = createFakeRequest({
			raw: {
				request: {
					bodyChunks: ["abcd"],
				},
			},
		});
		const destroySpy = vi.spyOn(request.raw.request, "destroy");

		const result = await readRequestText(request.raw.request, { maxBodySize: 3 });

		expect(E.hasInformation(result, "error")).toBe(true);
		expect(unwrap(result)).toBeInstanceOf(BodySizeExceedsLimitError);
		expect(destroySpy).toHaveBeenCalled();
	});

	it("returns server-error when stream fails", async() => {
		const error = new Error("boom");
		const request = createFakeRequest({
			raw: {
				request: {
					bodyIteratorError: error,
				},
			},
		});
		const destroySpy = vi.spyOn(request.raw.request, "destroy");

		const result = await readRequestText(request.raw.request, { maxBodySize: 100 });

		expect(E.hasInformation(result, "server-error")).toBe(true);
		expect(unwrap(result)).toBe(error);
		expect(destroySpy).toHaveBeenCalled();
	});
});
