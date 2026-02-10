import { DP, stringToBytes } from "@duplojs/utils";
import { createBodyExtractor } from "./bodyExtractor";
import { createBodyReception, type ReadReceivedBodyParams } from "./receivedBody";

export interface TextReadReceivedBodyParams extends ReadReceivedBodyParams {

}

export const ReceivedTextBody = createBodyReception<"text", TextReadReceivedBodyParams>("text");
export type ReceivedTextBody = typeof ReceivedTextBody;

const _asText = createBodyExtractor(
	ReceivedTextBody,
	(params) => ({
		bodyMaxSize: params.bodyMaxSize && stringToBytes(params.bodyMaxSize),
	}),
);

export function asText<
	GenericDataParser extends DP.DataParser,
>(
	dataParser: GenericDataParser,
	params?: TextReadReceivedBodyParams,
) {
	return _asText(
		dataParser,
		params ?? {},
	);
}

export function asJSON<
	GenericShape extends DP.DataParserObjectShape,
>(
	shape: GenericShape,
	params?: TextReadReceivedBodyParams,
) {
	return _asText(
		DP.object(shape),
		params ?? {},
	);
}

