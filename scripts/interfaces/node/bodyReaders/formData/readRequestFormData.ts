
import { E, forwardLog, Path, S, type MaybePromise } from "@duplojs/utils";
import type http from "http";
import { BodyParseFormDataError } from "./error";
import { BodyParseWrongChunkReceived, BodySizeExceedsLimitError } from "@core/errors";

const endHeaderPart = Buffer.from("\r\n\r\n");
const bufferStart = Buffer.from("\r\n");
const regexBoundary = /boundary=(?<boundary>[^; ]+)/i;
const regexHeaderPart = /name="(?<name>(?:\\"|[^"])+)"(?:; filename="(?<filename>(?:\\"|[^"])+)")?(?:;\s+filename\*=[^']+'[^']*'(?<encodedFilename>[^;\r\n\s]+))?/i;

function safeDecode(value: string) {
	try {
		return decodeURIComponent(value);
	} catch {
		return value;
	}
}

interface HeaderPartInformation {
	name: string;
	filename?: string;
}

export interface ReadRequestFormDataStreamChunkEvent<
	GenericValueAccumulator extends unknown = unknown,
> {
	onReceiveChunk(chunk: Buffer): MaybePromise<void>;
	onEndPart(valueAccumulator: GenericValueAccumulator): MaybePromise<GenericValueAccumulator>;
	onError(error: unknown, valueAccumulator: GenericValueAccumulator): MaybePromise<void>;
}

export interface ReadRequestFormDataParams {
	maxBodySize: number;
	maxFileQuantity: number;
	fileMaxSize?: number;
	mimeType?: RegExp;
}

export async function readRequestFormData<
	GenericValueAccumulator extends unknown,
>(
	request: http.IncomingMessage,
	firstValueAccumulator: GenericValueAccumulator,
	params: ReadRequestFormDataParams,
	onReceiveHeader: (header: HeaderPartInformation) => MaybePromise<
		ReadRequestFormDataStreamChunkEvent<GenericValueAccumulator>
	>,
): Promise<
	| E.Left<"server-error", unknown>
	| E.Error<Error>
	| GenericValueAccumulator
	> {
	const boundary = S.extract(
		request.headers["content-type"] ?? "",
		regexBoundary,
	)?.namedGroups?.boundary;

	if (!boundary) {
		return E.error(new BodyParseFormDataError("Wrong boundary."));
	}

	let valueAccumulator: GenericValueAccumulator = firstValueAccumulator;

	const startPart = Buffer.from(`\r\n--${boundary}`);
	const endMultiPart = Buffer.from(`\r\n--${boundary}--`);

	let currentBuffer = bufferStart;
	let size = 0;
	const keep = endMultiPart.length - 1;

	let currentStream = undefined as ReadRequestFormDataStreamChunkEvent<GenericValueAccumulator> | undefined;
	let fileQuantity = 0;
	let currentFileSize = undefined as undefined | number;

	const checkSize = (receivedChunk: Buffer): true | Error => {
		size += receivedChunk.length;

		return size > params.maxBodySize
			? new BodySizeExceedsLimitError(params.maxBodySize)
			: true;
	};

	const flushReceiveHeader = async(headerPart: Buffer): Promise<Error | true> => {
		valueAccumulator = await currentStream?.onEndPart(valueAccumulator) ?? valueAccumulator;

		const sizeResult = checkSize(headerPart);
		if (sizeResult !== true) {
			return sizeResult;
		}

		const extract = S.extract(
			headerPart.toString("latin1"),
			regexHeaderPart,
		)?.namedGroups;

		const header = extract?.name
			? {
				name: extract.name,
				filename: extract.encodedFilename !== undefined
					? safeDecode(extract.encodedFilename)
					: extract.filename,
			}
			: null;

		if (!header?.name) {
			return new BodyParseFormDataError("Bad content header part.");
		}

		if (header.filename !== undefined) {
			currentFileSize = 0;
			fileQuantity++;
			if (fileQuantity > params.maxFileQuantity) {
				return new BodyParseFormDataError("File quantity exceeds limit.");
			} else if (
				params.mimeType !== undefined
				&& !params.mimeType.test(Path.getExtensionName(header.filename) ?? "")
			) {
				return new BodyParseFormDataError("File have wrong mimeType.");
			}
		} else {
			currentFileSize = undefined;
		}

		const newStream = await onReceiveHeader(header);

		if (E.isLeft(newStream)) {
			return newStream;
		}

		currentStream = newStream;

		return true;
	};

	const flushReceiveChunk = async(chunk: Buffer): Promise<Error | true> => {
		if (chunk.length === 0) {
			return true;
		}

		const sizeResult = checkSize(chunk);
		if (sizeResult !== true) {
			return sizeResult;
		}

		if (!currentStream) {
			return new BodyParseFormDataError("Receive chunk before header part.");
		}

		if (typeof currentFileSize === "number") {
			currentFileSize += chunk.length;
			if (params.fileMaxSize !== undefined && currentFileSize > params.fileMaxSize) {
				return new BodyParseFormDataError("File size exceeds limit.");
			}
		}

		await currentStream.onReceiveChunk(chunk);

		return true;
	};

	const treatError = async(error: Error): Promise<E.Error<Error>> => {
		await currentStream?.onError(error, valueAccumulator);
		return E.error(error);
	};

	try {
		for await (const chunk of request) {
			if (!(chunk instanceof Buffer)) {
				return await treatError(new BodyParseWrongChunkReceived("Buffer.", chunk));
			}

			currentBuffer = Buffer.concat([currentBuffer, chunk]);

			while (true) {
				const endMultiPartIndex = currentBuffer.indexOf(endMultiPart);
				if (endMultiPartIndex !== -1) {
					// check if buffer contain end of transmissions
					currentBuffer = currentBuffer.subarray(0, endMultiPartIndex);
				}

				const startPartIndex = currentBuffer.indexOf(startPart);
				const endHeaderPartIndex = currentBuffer.indexOf(endHeaderPart);
				if (startPartIndex !== -1 && endHeaderPartIndex !== -1) {
					// check if buffer contain an entire header of part
					const resultChunk = await flushReceiveChunk(
						currentBuffer.subarray(0, startPartIndex),
					);

					if (resultChunk !== true) {
						return await treatError(resultChunk);
					}

					const endIndex = endHeaderPartIndex + endHeaderPart.length;

					const resultHeader = await flushReceiveHeader(
						currentBuffer.subarray(startPartIndex, endIndex),
					);

					if (resultHeader !== true) {
						return await treatError(resultHeader);
					}
					currentBuffer = currentBuffer.subarray(endIndex);
				} else if (startPartIndex === -1 && endHeaderPartIndex === -1) {
					// check if buffer contain only data
					if (currentBuffer.length > keep) {
						const bufferRestIndex = currentBuffer.length - keep;
						const resultChunk = await flushReceiveChunk(
							currentBuffer.subarray(0, bufferRestIndex),
						);

						if (resultChunk !== true) {
							return await treatError(resultChunk);
						}

						currentBuffer = currentBuffer.subarray(bufferRestIndex);
					}

					break;
				} else if (startPartIndex !== -1 && endHeaderPartIndex === -1) {
					// check if buffer contain start of header but not contain end
					break;
				} else if (startPartIndex === -1 && endHeaderPartIndex !== -1) {
					// check if buffer contain only end of header part
					return await treatError(new BodyParseFormDataError("Wrong content."));
				}
			}
		}

		const resultChunk = await flushReceiveChunk(currentBuffer);

		if (resultChunk !== true) {
			return await treatError(resultChunk);
		}

		valueAccumulator = await currentStream?.onEndPart(valueAccumulator) ?? valueAccumulator;

		return valueAccumulator;
	} catch (error) {
		await currentStream?.onError(error, valueAccumulator);
		return E.left("server-error", error);
	} finally {
		request.destroy();
	}
}
