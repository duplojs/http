import { BodyParseWrongChunkReceived, BodySizeExceedsLimitError } from "@core/errors";
import { BodyParseFormDataError, readRequestFormData } from "@interface-node";
import { E, unwrap } from "@duplojs/utils";
import { createFakeRequest } from "@test-utils/request";

describe("readRequestFormData", () => {
	const boundary = "duplo-boundary";
	const contentType = `multipart/form-data; boundary=${boundary}`;

	it("returns error when boundary is missing", async() => {
		const request = createFakeRequest({
			raw: {
				request: {
					headers: {
						"content-type": "multipart/form-data",
					},
					bodyChunks: [],
				},
			},
		});

		const result = await readRequestFormData(
			request.raw.request,
			{},
			{
				maxBodySize: 1000,
				maxBufferSize: 10000,
				maxKeyLength: 100,
				maxFileQuantity: 1,
			},
			() => ({
				onReceiveChunk: () => {},
				onEndPart: (value) => value,
				onError: () => {},
			}),
		);

		expect(E.hasInformation(result, "error")).toBe(true);
		expect(unwrap(result)).toBeInstanceOf(BodyParseFormDataError);
	});

	it("returns error when content-type is missing", async() => {
		const request = createFakeRequest({
			raw: {
				request: {
					bodyChunks: [],
				},
			},
		});

		const result = await readRequestFormData(
			request.raw.request,
			{},
			{
				maxBodySize: 1000,
				maxBufferSize: 10000,
				maxKeyLength: 100,
				maxFileQuantity: 1,
			},
			() => ({
				onReceiveChunk: () => {},
				onEndPart: (value) => value,
				onError: () => {},
			}),
		);

		expect(E.hasInformation(result, "error")).toBe(true);
		expect(unwrap(result)).toBeInstanceOf(BodyParseFormDataError);
	});

	it("parses field and file parts with heavily split header and streaming data", async() => {
		const request = createFakeRequest({
			raw: {
				request: {
					headers: {
						"content-type": contentType,
					},
					bodyChunks: [
						Buffer.from(`--${boundary}\r\nContent-`),
						Buffer.from("Disposition: form-data; name=\"fi"),
						Buffer.from("eld\"\r\n\r\nva"),
						Buffer.from(`lue\r\n--${boundary}\r\nContent-`),
						Buffer.from("Disposition: form-data; name=\"fi"),
						Buffer.from("le\"; filename=\"ignored"),
						Buffer.from(".txt\"; filename*=utf-8''file%20"),
						Buffer.from("name.txt\r\nContent-Type: text/"),
						Buffer.from("plain\r\n\r\n"),
						Buffer.from("A".repeat(40)),
						Buffer.from(`\r\n--${boundary}--`),
					],
				},
			},
		});
		const destroySpy = vi.spyOn(request.raw.request, "destroy");
		const accumulator = {
			fields: {} as Record<string, string>,
			files: [] as {
				name: string;
				filename: string;
				data: string;
			}[],
		};

		const result = await readRequestFormData(
			request.raw.request,
			accumulator,
			{
				maxBodySize: 10000,
				maxBufferSize: 20000,
				maxKeyLength: 100,
				maxFileQuantity: 2,
				mimeType: /txt/,
			},
			(header) => {
				if (header.filename) {
					let fileData = "";
					return {
						onReceiveChunk: (chunk) => {
							fileData += chunk.toString("utf-8");
						},
						onEndPart: (value) => {
							value.files.push({
								name: header.name,
								filename: header.filename ?? "",
								data: fileData,
							});
							return value;
						},
						onError: () => {},
					};
				}

				let fieldValue = "";
				return {
					onReceiveChunk: (chunk) => {
						fieldValue += chunk.toString("utf-8");
					},
					onEndPart: (value) => {
						value.fields[header.name] = fieldValue;
						return value;
					},
					onError: () => {},
				};
			},
		);

		expect(result).toStrictEqual({
			fields: { field: "value" },
			files: [
				{
					name: "file",
					filename: "file name.txt",
					data: "A".repeat(40),
				},
			],
		});
		expect(destroySpy).toHaveBeenCalled();
	});

	it("returns error for wrong chunk type and calls onError", async() => {
		const onError = vi.fn();
		const request = createFakeRequest({
			raw: {
				request: {
					headers: {
						"content-type": contentType,
					},
					bodyChunks: [
						Buffer.from(
							`--${boundary}\r\nContent-Disposition: form-data; name="field"\r\n\r\n`,
						),
						"not-a-buffer",
					],
				},
			},
		});

		const result = await readRequestFormData(
			request.raw.request,
			{},
			{
				maxBodySize: 1000,
				maxBufferSize: 10000,
				maxKeyLength: 100,
				maxFileQuantity: 1,
			},
			() => ({
				onReceiveChunk: () => {},
				onEndPart: (value) => value,
				onError,
			}),
		);

		expect(E.hasInformation(result, "error")).toBe(true);
		expect(unwrap(result)).toBeInstanceOf(BodyParseWrongChunkReceived);
		expect(onError).toHaveBeenCalled();
	});

	it("returns error when body size exceeds limit", async() => {
		const request = createFakeRequest({
			raw: {
				request: {
					headers: {
						"content-type": contentType,
					},
					bodyChunks: [
						Buffer.from(`--${boundary}\r\nContent-`),
						Buffer.from("Disposition: form-data; name=\"fi"),
						Buffer.from("eld\"\r\n\r\n"),
						Buffer.from("val"),
						Buffer.from(`ue\r\n--${boundary}`),
						Buffer.from("--"),
					],
				},
			},
		});

		const result = await readRequestFormData(
			request.raw.request,
			{},
			{
				maxBodySize: 5,
				maxBufferSize: 10000,
				maxKeyLength: 100,
				maxFileQuantity: 1,
			},
			() => ({
				onReceiveChunk: () => {},
				onEndPart: (value) => value,
				onError: () => {},
			}),
		);

		expect(E.hasInformation(result, "error")).toBe(true);
		expect(unwrap(result)).toBeInstanceOf(BodySizeExceedsLimitError);
	});

	it("returns error when streaming data exceeds max body size", async() => {
		const request = createFakeRequest({
			raw: {
				request: {
					headers: {
						"content-type": contentType,
					},
					bodyChunks: [
						Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="field"\r\n\r\n`),
						Buffer.from("A".repeat(2000)),
					],
				},
			},
		});
		const onError = vi.fn();

		const result = await readRequestFormData(
			request.raw.request,
			{},
			{
				maxBodySize: 1800,
				maxBufferSize: 2000,
				maxKeyLength: 100,
				maxFileQuantity: 1,
			},
			() => ({
				onReceiveChunk: () => {},
				onEndPart: (value) => value,
				onError,
			}),
		);

		expect(E.hasInformation(result, "error")).toBe(true);
		expect(unwrap(result)).toBeInstanceOf(BodySizeExceedsLimitError);
		expect(onError).toHaveBeenCalled();
	});

	it("returns error when buffer size exceeds limit", async() => {
		const request = createFakeRequest({
			raw: {
				request: {
					headers: {
						"content-type": contentType,
					},
					bodyChunks: [Buffer.from("A".repeat(20))],
				},
			},
		});

		const result = await readRequestFormData(
			request.raw.request,
			{},
			{
				maxBodySize: 1000,
				maxBufferSize: 5,
				maxKeyLength: 100,
				maxFileQuantity: 1,
			},
			() => ({
				onReceiveChunk: () => {},
				onEndPart: (value) => value,
				onError: () => {},
			}),
		);

		expect(E.hasInformation(result, "error")).toBe(true);
		expect(unwrap(result)).toBeInstanceOf(BodyParseFormDataError);
	});

	it("returns error for invalid header part", async() => {
		const request = createFakeRequest({
			raw: {
				request: {
					headers: {
						"content-type": contentType,
					},
					bodyChunks: [
						Buffer.from(`--${boundary}\r\nContent-`),
						Buffer.from("Disposition: form-data\r\n"),
						Buffer.from("\r\nval"),
						Buffer.from(`ue\r\n--${boundary}`),
						Buffer.from("--"),
					],
				},
			},
		});

		const result = await readRequestFormData(
			request.raw.request,
			{},
			{
				maxBodySize: 1000,
				maxBufferSize: 10000,
				maxKeyLength: 100,
				maxFileQuantity: 1,
			},
			() => ({
				onReceiveChunk: () => {},
				onEndPart: (value) => value,
				onError: () => {},
			}),
		);

		expect(E.hasInformation(result, "error")).toBe(true);
		expect(unwrap(result)).toBeInstanceOf(BodyParseFormDataError);
	});

	it("returns error when key length exceeds limit", async() => {
		const longKey = "a".repeat(6);
		const request = createFakeRequest({
			raw: {
				request: {
					headers: {
						"content-type": contentType,
					},
					bodyChunks: [
						Buffer.from(`--${boundary}\r\nContent-`),
						Buffer.from(`Disposition: form-data; name="${longKey}"\r\n\r\n`),
						Buffer.from(`value\r\n--${boundary}`),
						Buffer.from("--"),
					],
				},
			},
		});

		const result = await readRequestFormData(
			request.raw.request,
			{},
			{
				maxBodySize: 1000,
				maxBufferSize: 10000,
				maxFileQuantity: 1,
				maxKeyLength: 5,
			},
			() => ({
				onReceiveChunk: () => {},
				onEndPart: (value) => value,
				onError: () => {},
			}),
		);

		expect(E.hasInformation(result, "error")).toBe(true);
		expect(unwrap(result)).toBeInstanceOf(BodyParseFormDataError);
	});

	it("returns error when file quantity exceeds limit", async() => {
		const request = createFakeRequest({
			raw: {
				request: {
					headers: {
						"content-type": contentType,
					},
					bodyChunks: [
						Buffer.from(`--${boundary}\r\nContent-`),
						Buffer.from("Disposition: form-data; name=\"file1\"; fil"),
						Buffer.from(`ename="a.txt"\r\n\r\nA\r\n--${boundary}\r\nContent-`),
						Buffer.from("Disposition: form-data; name=\"file2\"; fil"),
						Buffer.from(`ename="b.txt"\r\n\r\nB\r\n--${boundary}`),
						Buffer.from("--"),
					],
				},
			},
		});

		const result = await readRequestFormData(
			request.raw.request,
			{},
			{
				maxBodySize: 1000,
				maxBufferSize: 10000,
				maxKeyLength: 100,
				maxFileQuantity: 1,
			},
			() => ({
				onReceiveChunk: () => {},
				onEndPart: (value) => value,
				onError: () => {},
			}),
		);

		expect(E.hasInformation(result, "error")).toBe(true);
		expect(unwrap(result)).toBeInstanceOf(BodyParseFormDataError);
	});

	it("returns error when file mimeType is wrong and decode fails", async() => {
		const request = createFakeRequest({
			raw: {
				request: {
					headers: {
						"content-type": contentType,
					},
					bodyChunks: [
						Buffer.from(`--${boundary}\r\nContent-`),
						Buffer.from("Disposition: form-data; name=\"file\"; filename=\"fallback"),
						Buffer.from(".txt\"; filename*=utf-8''%E0%A4\r\n"),
						Buffer.from(`\r\nA\r\n--${boundary}`),
						Buffer.from("--"),
					],
				},
			},
		});

		const result = await readRequestFormData(
			request.raw.request,
			{},
			{
				maxBodySize: 1000,
				maxBufferSize: 10000,
				maxKeyLength: 100,
				maxFileQuantity: 1,
				mimeType: /txt/,
			},
			() => ({
				onReceiveChunk: () => {},
				onEndPart: (value) => value,
				onError: () => {},
			}),
		);

		expect(E.hasInformation(result, "error")).toBe(true);
		expect(unwrap(result)).toBeInstanceOf(BodyParseFormDataError);
	});

	it("returns error when file size exceeds limit and calls onError", async() => {
		const onError = vi.fn();
		const request = createFakeRequest({
			raw: {
				request: {
					headers: {
						"content-type": contentType,
					},
					bodyChunks: [
						Buffer.from(`--${boundary}\r\nContent-`),
						Buffer.from("Disposition: form-data; name=\"file\"; filename=\"a.txt\""),
						Buffer.from("\r\n\r\n"),
						Buffer.from("AB"),
						Buffer.from("CDE"),
						Buffer.from(`\r\n--${boundary}`),
						Buffer.from("--"),
					],
				},
			},
		});

		const result = await readRequestFormData(
			request.raw.request,
			{},
			{
				maxBodySize: 1000,
				maxBufferSize: 10000,
				maxKeyLength: 100,
				maxFileQuantity: 1,
				fileMaxSize: 3,
			},
			() => ({
				onReceiveChunk: () => {},
				onEndPart: (value) => value,
				onError,
			}),
		);

		expect(E.hasInformation(result, "error")).toBe(true);
		expect(unwrap(result)).toBeInstanceOf(BodyParseFormDataError);
		expect(onError).toHaveBeenCalled();
	});

	it("returns error when chunk arrives before header", async() => {
		const request = createFakeRequest({
			raw: {
				request: {
					headers: {
						"content-type": contentType,
					},
					bodyChunks: [
						Buffer.from("ab"),
						Buffer.from(`c\r\n--${boundary}\r\nContent-`),
						Buffer.from("Disposition: form-data; name=\"field\"\r\n\r\n"),
						Buffer.from(`value\r\n--${boundary}`),
						Buffer.from("--"),
					],
				},
			},
		});

		const result = await readRequestFormData(
			request.raw.request,
			{},
			{
				maxBodySize: 1000,
				maxBufferSize: 10000,
				maxKeyLength: 100,
				maxFileQuantity: 1,
			},
			() => ({
				onReceiveChunk: () => {},
				onEndPart: (value) => value,
				onError: () => {},
			}),
		);

		expect(E.hasInformation(result, "error")).toBe(true);
		expect(unwrap(result)).toBeInstanceOf(BodyParseFormDataError);
	});

	it("returns error for wrong content without boundary", async() => {
		const request = createFakeRequest({
			raw: {
				request: {
					headers: {
						"content-type": contentType,
					},
					bodyChunks: [Buffer.from("\r\n"), Buffer.from("\r\n")],
				},
			},
		});

		const result = await readRequestFormData(
			request.raw.request,
			{},
			{
				maxBodySize: 1000,
				maxBufferSize: 10000,
				maxKeyLength: 100,
				maxFileQuantity: 1,
			},
			() => ({
				onReceiveChunk: () => {},
				onEndPart: (value) => value,
				onError: () => {},
			}),
		);

		expect(E.hasInformation(result, "error")).toBe(true);
		expect(unwrap(result)).toBeInstanceOf(BodyParseFormDataError);
	});

	it("returns accumulator when payload contains only end boundary", async() => {
		const localBoundary = "end-only";
		const localContentType = `multipart/form-data; boundary=${localBoundary}`;
		const request = createFakeRequest({
			raw: {
				request: {
					headers: {
						"content-type": localContentType,
					},
					bodyChunks: [Buffer.from(`--${localBoundary}--`)],
				},
			},
		});
		const accumulator = { ok: true };

		const result = await readRequestFormData(
			request.raw.request,
			accumulator,
			{
				maxBodySize: 1000,
				maxBufferSize: 10000,
				maxKeyLength: 100,
				maxFileQuantity: 1,
			},
			() => ({
				onReceiveChunk: () => {},
				onEndPart: (value) => value,
				onError: () => {},
			}),
		);

		expect(result).toBe(accumulator);
	});

	it("returns error when onReceiveHeader returns Error", async() => {
		const request = createFakeRequest({
			raw: {
				request: {
					headers: {
						"content-type": contentType,
					},
					bodyChunks: [
						Buffer.from(`--${boundary}\r\nContent-`),
						Buffer.from("Disposition: form-data; name=\"field\"\r\n\r\n"),
						Buffer.from(`value\r\n--${boundary}`),
						Buffer.from("--"),
					],
				},
			},
		});

		const result = await readRequestFormData(
			request.raw.request,
			{},
			{
				maxBodySize: 1000,
				maxBufferSize: 10000,
				maxKeyLength: 100,
				maxFileQuantity: 1,
			},
			() => new Error("nope"),
		);

		expect(E.hasInformation(result, "error")).toBe(true);
		expect(unwrap(result)).toStrictEqual(new Error("nope"));
	});

	it("returns server-error when stream processing throws and calls onError", async() => {
		const error = new Error("boom");
		const onError = vi.fn();
		const request = createFakeRequest({
			raw: {
				request: {
					headers: {
						"content-type": contentType,
					},
					bodyChunks: [
						Buffer.from(`--${boundary}\r\nContent-`),
						Buffer.from("Disposition: form-data; name=\"field\"\r\n\r\n"),
						Buffer.from(`value\r\n--${boundary}`),
						Buffer.from("--"),
					],
				},
			},
		});

		const result = await readRequestFormData(
			request.raw.request,
			{},
			{
				maxBodySize: 1000,
				maxBufferSize: 10000,
				maxKeyLength: 100,
				maxFileQuantity: 1,
			},
			() => ({
				onReceiveChunk: () => {
					throw error;
				},
				onEndPart: (value) => value,
				onError,
			}),
		);

		expect(E.hasInformation(result, "server-error")).toBe(true);
		expect(unwrap(result)).toBe(error);
		expect(onError).toHaveBeenCalled();
	});
});
