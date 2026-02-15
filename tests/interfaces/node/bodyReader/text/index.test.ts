import {
	BodySizeExceedsLimitError,
	ParseJsonError,
	WrongContentTypeError,
} from "@core/errors";
import { createTextBodyReaderImplementation } from "@interface-node/bodyReaders/text";
import { E, unwrap } from "@duplojs/utils";
import { createFakeRequest } from "@test-utils/request";
import { type HttpServerParams } from "@core";

describe("createTextBodyReaderImplementation", () => {
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

	it("returns WrongContentTypeError when content-type is unsupported", async() => {
		const request = createFakeRequest({
			headers: {
				"content-type": "application/xml",
			},
		});
		const reader = createTextBodyReaderImplementation(serverParams);

		const result = await reader.read(request, {});

		expect(E.hasInformation(result, "error")).toBe(true);
		expect(unwrap(result)).toBeInstanceOf(WrongContentTypeError);
	});

	it("returns WrongContentTypeError when content-type is missing", async() => {
		const request = createFakeRequest();
		const reader = createTextBodyReaderImplementation(serverParams);

		const result = await reader.read(request, {});

		expect(E.hasInformation(result, "error")).toBe(true);
		expect(unwrap(result)).toBeInstanceOf(WrongContentTypeError);
	});

	it("parses json body when content-type is application/json", async() => {
		const request = createFakeRequest({
			headers: {
				"content-type": "application/json; charset=utf-8",
			},
			raw: {
				request: {
					bodyChunks: ["{\"ok\":true}"],
				},
			},
		});
		const reader = createTextBodyReaderImplementation(serverParams);

		const result = await reader.read(request, {});

		expect(result).toStrictEqual(E.success({ ok: true }));
	});

	it("returns ParseJsonError when json body is invalid", async() => {
		const request = createFakeRequest({
			headers: {
				"content-type": "application/json",
			},
			raw: {
				request: {
					bodyChunks: ["{"],
				},
			},
		});
		const reader = createTextBodyReaderImplementation(serverParams);

		const result = await reader.read(request, {});

		expect(E.hasInformation(result, "error")).toBe(true);
		expect(unwrap(result)).toBeInstanceOf(ParseJsonError);
	});

	it("returns text body when content-type is text/plain", async() => {
		const request = createFakeRequest({
			headers: {
				"content-type": "text/plain",
			},
			raw: {
				request: {
					bodyChunks: ["hello"],
				},
			},
		});
		const reader = createTextBodyReaderImplementation(serverParams);

		const result = await reader.read(request, {});

		expect(result).toStrictEqual(E.success("hello"));
	});

	it("uses bodyMaxSize from params when provided", async() => {
		const request = createFakeRequest({
			headers: {
				"content-type": "text/plain",
			},
			raw: {
				request: {
					bodyChunks: ["abcd"],
				},
			},
		});
		const reader = createTextBodyReaderImplementation(serverParams);

		const result = await reader.read(request, { bodyMaxSize: 3 });

		expect(E.hasInformation(result, "error")).toBe(true);
		expect(unwrap(result)).toBeInstanceOf(BodySizeExceedsLimitError);
		expect((unwrap(result) as BodySizeExceedsLimitError).bytesInString).toBe(3);
	});

	it("throws when readRequestText returns server-error", async() => {
		const error = new Error("boom");
		const request = createFakeRequest({
			headers: {
				"content-type": "text/plain",
			},
			raw: {
				request: {
					bodyIteratorError: error,
				},
			},
		});
		const reader = createTextBodyReaderImplementation(serverParams);

		await expect(reader.read(request, {})).rejects.toBe(error);
	});
});
