import { fsSpy, fsSpyResetMock } from "@test-utils/fs";
import { WrongContentTypeError } from "@core/errors";
import { createFormDataBodyReaderImplementation } from "@interface-node/bodyReaders/formData";
import { E, unwrap } from "@duplojs/utils";
import { createFakeRequest } from "@test-utils/request";
import { SF } from "@duplojs/server-utils";
import type { HttpServerParams } from "@core";
import { EventEmitter } from "node:events";

describe("createFormDataBodyReaderImplementation", () => {
	const boundary = "duplo-boundary";
	const contentType = `multipart/form-data; boundary=${boundary}`;
	const serverParams: HttpServerParams = {
		interface: "node",
		host: "localhost",
		port: 3000,
		maxBodySize: "10mb",
		informationHeaderKey: "information",
		predictedHeaderKey: "predicted",
		fromHookHeaderKey: "from-hook",
		uploadFolder: "./upload",
	};

	beforeEach(() => {
		fsSpyResetMock();
	});

	function makeStreamMock(
		path: string,
		writeImpl: (chunk: Buffer, callback?: (error?: Error | null) => void) => void,
	) {
		const stream = new EventEmitter() as EventEmitter & {
			path: string;
			write: ReturnType<typeof vi.fn>;
			end: ReturnType<typeof vi.fn>;
		};

		stream.path = path;
		stream.write = vi.fn(writeImpl);
		stream.end = vi.fn();

		return stream;
	}

	it("returns WrongContentTypeError when content-type is unsupported", async() => {
		const request = createFakeRequest({
			headers: {
				"content-type": "application/xml",
			},
			raw: {
				request: {
					headers: {
						"content-type": "application/xml",
					},
					bodyChunks: [],
				},
			},
		});
		const reader = createFormDataBodyReaderImplementation(serverParams);

		const result = await reader.read(request, {
			maxFileQuantity: 1,
			maxBufferSize: 10000,
			maxKeyLength: 100,
			maxIndexArray: 2500,
		});

		expect(E.hasInformation(result, "error")).toBe(true);
		expect(unwrap(result)).toBeInstanceOf(WrongContentTypeError);
	});

	it("returns WrongContentTypeError when content-type is missing", async() => {
		const request = createFakeRequest({
			headers: {},
			raw: {
				request: {
					headers: {},
					bodyChunks: [],
				},
			},
		});
		const reader = createFormDataBodyReaderImplementation(serverParams);

		const result = await reader.read(request, {
			maxFileQuantity: 1,
			maxBufferSize: 10000,
			maxKeyLength: 100,
			maxIndexArray: 2500,
		});

		expect(E.hasInformation(result, "error")).toBe(true);
		expect(unwrap(result)).toBeInstanceOf(WrongContentTypeError);
	});

	it("returns WrongContentTypeError when content-type is an array", async() => {
		const request = createFakeRequest({
			headers: {
				"content-type": ["application/xml", "text/plain"],
			} as any,
			raw: {
				request: {
					headers: {
						"content-type": ["application/xml", "text/plain"],
					} as any,
					bodyChunks: [],
				},
			},
		});
		const reader = createFormDataBodyReaderImplementation(serverParams);

		const result = await reader.read(request, {
			maxFileQuantity: 1,
			maxBufferSize: 10000,
			maxKeyLength: 100,
			maxIndexArray: 2500,
		});

		expect(E.hasInformation(result, "error")).toBe(true);
		expect(unwrap(result)).toBeInstanceOf(WrongContentTypeError);
	});

	it("parses text field and returns file interface values", async() => {
		const request = createFakeRequest({
			headers: {
				"content-type": contentType,
			},
			raw: {
				request: {
					headers: {
						"content-type": contentType,
					},
					bodyChunks: [
						Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="field"\r\n\r\n`),
						Buffer.from("hello"),
						Buffer.from(`\r\n--${boundary}--`),
					],
				},
			},
		});
		const reader = createFormDataBodyReaderImplementation(serverParams);

		const result = await reader.read(request, {
			maxFileQuantity: 1,
			maxBufferSize: 10000,
			maxKeyLength: 100,
			maxIndexArray: 2500,
		});

		expect(E.hasInformation(result, "success")).toBe(true);
		const body = unwrap(result) as Record<string, unknown>;
		expect(body.field).toBe("hello");
	});

	it("merges values when the same field appears multiple times", async() => {
		const request = createFakeRequest({
			headers: {
				"content-type": contentType,
			},
			raw: {
				request: {
					headers: {
						"content-type": contentType,
					},
					bodyChunks: [
						Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="field"\r\n\r\n`),
						Buffer.from("one"),
						Buffer.from(`\r\n--${boundary}\r\nContent-Disposition: form-data; name="field"\r\n\r\n`),
						Buffer.from("two"),
						Buffer.from(`\r\n--${boundary}--`),
					],
				},
			},
		});
		const reader = createFormDataBodyReaderImplementation(serverParams);

		const result = await reader.read(request, {
			maxFileQuantity: 1,
			maxBufferSize: 10000,
			maxKeyLength: 100,
			maxIndexArray: 2500,
		});

		expect(E.hasInformation(result, "success")).toBe(true);
		const body = unwrap(result) as Record<string, unknown>;
		expect(Array.isArray(body.field)).toBe(true);
		const values = body.field as SF.FileInterface[];
		expect(values).toHaveLength(2);
		expect(values[0]).toBe("one");
		expect(values[1]).toBe("two");
	});

	it("parses file field and writes file stream", async() => {
		const writeImpl = (__: Buffer, cb?: (err?: Error | null) => void) => cb?.(null);
		fsSpy.createWriteStream.mockImplementation((path: string) => {
			const stream = makeStreamMock(path, writeImpl);
			queueMicrotask(() => void stream.emit("open"));
			return stream as any;
		});

		const request = createFakeRequest({
			headers: {
				"content-type": contentType,
			},
			raw: {
				request: {
					headers: {
						"content-type": contentType,
					},
					bodyChunks: [
						Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="a.txt"\r\n\r\n`),
						Buffer.from("DATA"),
						Buffer.from(`\r\n--${boundary}--`),
					],
					readableHighWaterMark: 16,
				},
			},
		});
		const reader = createFormDataBodyReaderImplementation(serverParams);

		const result = await reader.read(request, {
			maxFileQuantity: 1,
			maxBufferSize: 10000,
			maxKeyLength: 100,
			maxIndexArray: 2500,
		});

		expect(fsSpy.createWriteStream).toHaveBeenCalledTimes(1);
		const filePath = (fsSpy.createWriteStream.mock.calls[0] as [string])[0];
		const currentFile = fsSpy.createWriteStream.mock.results[0]?.value as ReturnType<typeof makeStreamMock>;
		expect(request.filesAttache).toStrictEqual([filePath]);
		expect(currentFile.write).toHaveBeenCalled();
		expect(currentFile.end).toHaveBeenCalled();

		expect(E.hasInformation(result, "success")).toBe(true);
		const body = unwrap(result) as Record<string, unknown>;
		expect(SF.isFileInterface(body.file)).toBe(true);
		expect((body.file as SF.FileInterface).path).toBe(filePath);
	});

	it("writes file stream without extension in filename", async() => {
		const writeImpl = (__: Buffer, cb?: (err?: Error | null) => void) => cb?.(null);
		fsSpy.createWriteStream.mockImplementation((path: string) => {
			const stream = makeStreamMock(path, writeImpl);
			queueMicrotask(() => void stream.emit("open"));
			return stream as any;
		});

		const request = createFakeRequest({
			headers: {
				"content-type": contentType,
			},
			raw: {
				request: {
					headers: {
						"content-type": contentType,
					},
					bodyChunks: [
						Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="noext"\r\n\r\n`),
						Buffer.from("DATA"),
						Buffer.from(`\r\n--${boundary}--`),
					],
					readableHighWaterMark: 16,
				},
			},
		});
		const reader = createFormDataBodyReaderImplementation(serverParams);

		const result = await reader.read(request, {
			maxFileQuantity: 1,
			maxBufferSize: 10000,
			maxKeyLength: 100,
			maxIndexArray: 2500,
		});

		const filePath = (fsSpy.createWriteStream.mock.calls.at(-1) as [string])[0];
		expect(filePath.split("/").at(-1)?.includes(".")).toBe(false);
		expect(E.hasInformation(result, "success")).toBe(true);
	});

	it("returns error when file size exceeds limit and closes stream", async() => {
		const writeImpl = (_chunk: any, callback?: (error?: any) => any) => callback?.(null);
		fsSpy.createWriteStream.mockImplementation((path: string) => {
			const stream = makeStreamMock(path, writeImpl);
			queueMicrotask(() => void stream.emit("open"));
			return stream;
		});

		const request = createFakeRequest({
			headers: {
				"content-type": contentType,
			},
			raw: {
				request: {
					headers: {
						"content-type": contentType,
					},
					bodyChunks: [
						Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="a.txt"\r\n\r\n`),
						Buffer.from("AB"),
						Buffer.from(`\r\n--${boundary}--`),
					],
				},
			},
		});
		const reader = createFormDataBodyReaderImplementation(serverParams);

		const result = await reader.read(request, {
			maxFileQuantity: 1,
			fileMaxSize: 1,
			maxBufferSize: 10000,
			maxKeyLength: 100,
			maxIndexArray: 2500,
		});

		expect(E.hasInformation(result, "error")).toBe(true);
		const currentFile = fsSpy.createWriteStream.mock.results[0]?.value as ReturnType<typeof makeStreamMock>;
		expect(currentFile.end).toHaveBeenCalled();
	});

	it("throws when file write callback returns error", async() => {
		const writeImpl = (__: Buffer, cb?: (err?: Error | null) => void) => cb?.(new Error("fail"));
		fsSpy.createWriteStream.mockImplementation((path: string) => {
			const stream = makeStreamMock(path, writeImpl);
			queueMicrotask(() => void stream.emit("open"));
			return stream as any;
		});

		const request = createFakeRequest({
			headers: {
				"content-type": contentType,
			},
			raw: {
				request: {
					headers: {
						"content-type": contentType,
					},
					bodyChunks: [
						Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="a.txt"\r\n\r\n`),
						Buffer.from("DATA"),
						Buffer.from(`\r\n--${boundary}--`),
					],
				},
			},
		});
		const reader = createFormDataBodyReaderImplementation(serverParams);

		await expect(reader.read(request, {
			maxFileQuantity: 1,
			maxBufferSize: 10000,
			maxKeyLength: 100,
			maxIndexArray: 2500,
		})).rejects.toBeInstanceOf(Error);

		const currentFile = fsSpy.createWriteStream.mock.results[0]?.value as ReturnType<typeof makeStreamMock>;
		expect(currentFile.end).toHaveBeenCalled();
	});

	it("retry file creation when path already exists", async() => {
		const streamError = Object.assign(new Error("exists"), { code: "EEXIST" });
		fsSpy.createWriteStream.mockImplementation((path: string) => {
			const stream = makeStreamMock(
				path,
				(_chunk: any, callback?: (error?: any) => any) => callback?.(null),
			);

			queueMicrotask(() => {
				if (fsSpy.createWriteStream.mock.calls.length === 1) {
					stream.emit("error", streamError);
					return;
				}

				stream.emit("open");
			});

			return stream as any;
		});

		const request = createFakeRequest({
			headers: {
				"content-type": contentType,
			},
			raw: {
				request: {
					headers: {
						"content-type": contentType,
					},
					bodyChunks: [
						Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="a.txt"\r\n\r\n`),
						Buffer.from("DATA"),
						Buffer.from(`\r\n--${boundary}--`),
					],
				},
			},
		});
		const reader = createFormDataBodyReaderImplementation(serverParams);

		const result = await reader.read(request, {
			maxFileQuantity: 1,
			maxBufferSize: 10000,
			maxKeyLength: 100,
			maxIndexArray: 2500,
		});

		expect(fsSpy.createWriteStream).toHaveBeenCalledTimes(2);
		expect(E.hasInformation(result, "success")).toBe(true);
		expect((fsSpy.createWriteStream.mock.calls[0] as [string])[0].endsWith(".txt")).toBe(true);
	});

	it("throws when file creation fails", async() => {
		const streamError = Object.assign(new Error("permission denied"), { code: "EACCES" });
		fsSpy.createWriteStream.mockImplementation((path: string) => {
			const stream = makeStreamMock(
				path,
				(_chunk: any, callback?: (error?: any) => any) => callback?.(null),
			);

			queueMicrotask(() => void stream.emit("error", streamError));

			return stream as any;
		});

		const request = createFakeRequest({
			headers: {
				"content-type": contentType,
			},
			raw: {
				request: {
					headers: {
						"content-type": contentType,
					},
					bodyChunks: [
						Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="a.txt"\r\n\r\n`),
						Buffer.from("DATA"),
						Buffer.from(`\r\n--${boundary}--`),
					],
				},
			},
		});
		const reader = createFormDataBodyReaderImplementation(serverParams);

		await expect(reader.read(request, {
			maxFileQuantity: 1,
			maxBufferSize: 10000,
			maxKeyLength: 100,
			maxIndexArray: 2500,
		})).rejects.toBe(streamError);

		expect(fsSpy.createWriteStream).toHaveBeenCalledTimes(1);
	});

	it("returns advanced object when content-type-options includes advanced", async() => {
		const request = createFakeRequest({
			headers: {
				"content-type": contentType,
				"content-type-options": "advanced",
			},
			raw: {
				request: {
					headers: {
						"content-type": contentType,
					},
					bodyChunks: [
						Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="user/*\\[0]/*\\name"\r\n\r\n`),
						Buffer.from("bob"),
						Buffer.from(`\r\n--${boundary}--`),
					],
				},
			},
		});
		const reader = createFormDataBodyReaderImplementation(serverParams);

		const result = await reader.read(request, {
			maxFileQuantity: 1,
			maxBufferSize: 10000,
			maxKeyLength: 100,
			maxIndexArray: 2500,
		});

		expect(E.hasInformation(result, "success")).toBe(true);
		const body = unwrap(result) as any;
		expect(body.user[0].name).toBeDefined();
		expect(body.user[0].name).toBe("bob");
	});

	it("throws when readRequestFormData returns server-error", async() => {
		const error = new Error("boom");
		const request = createFakeRequest({
			headers: {
				"content-type": contentType,
			},
			raw: {
				request: {
					headers: {
						"content-type": contentType,
					},
					bodyIteratorError: error,
				},
			},
		});
		const reader = createFormDataBodyReaderImplementation(serverParams);

		await expect(reader.read(request, {
			maxFileQuantity: 1,
			maxBufferSize: 10000,
			maxKeyLength: 100,
			maxIndexArray: 2500,
		})).rejects.toBe(error);
	});
});
