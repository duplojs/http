import { BodyParseWrongChunkReceived, BodySizeExceedsLimitError } from "@core/errors";
import { E } from "@duplojs/utils";
import type http from "http";

export interface ReadRequestTextParams {
	maxBodySize: number;
}

export async function readRequestText<
	GenericOutputValue extends unknown = string,
>(
	request: http.IncomingMessage,
	params: ReadRequestTextParams,
	onEnd?: (result: string) => GenericOutputValue,
): Promise<
	| E.Left<"server-error", unknown>
	| E.Error<Error>
	| GenericOutputValue
	> {
	let result = "";
	let size = 0;

	try {
		for await (const chunk of request) {
			if (!(chunk instanceof Buffer) && typeof chunk !== "string") {
				return E.error(new BodyParseWrongChunkReceived("Buffer or String.", chunk));
			}

			size += chunk instanceof Buffer
				? chunk.byteLength
				: Buffer.byteLength(chunk);

			if (size > params.maxBodySize) {
				return E.error(new BodySizeExceedsLimitError(params.maxBodySize));
			}

			result += chunk.toString();
		}

		if (onEnd) {
			return await onEnd(result);
		}

		return result as GenericOutputValue;
	} catch (error) {
		return E.left("server-error", error);
	} finally {
		request.destroy();
	}
}
