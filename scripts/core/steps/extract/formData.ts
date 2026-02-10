import { type BytesInString, DP, stringToBytes, toRegExp } from "@duplojs/utils";
import { createBodyReception, type ReadReceivedBodyParams } from "./receivedBody";
import { createBodyExtractor } from "./bodyExtractor";

export interface FormDataReadReceivedBodyParams extends ReadReceivedBodyParams {
	maxFileQuantity: number;
	mimeType?: RegExp;
	fileMaxSize?: number;
}

export const ReceivedFormDataBody = createBodyReception<"formData", FormDataReadReceivedBodyParams>("formData");
export type ReceivedFormDataBody = typeof ReceivedFormDataBody;

export interface AsFormDataParams {
	maxFileQuantity: number;
	mimeType?: string | string[] | RegExp;
	bodyMaxSize?: number | BytesInString;
	fileMaxSize?: number | BytesInString;
}

const _asFormData = createBodyExtractor(
	ReceivedFormDataBody,
	(params: AsFormDataParams) => ({
		maxFileQuantity: params.maxFileQuantity,
		bodyMaxSize: params.bodyMaxSize && stringToBytes(params.bodyMaxSize),
		fileMaxSize: params.fileMaxSize && stringToBytes(params.fileMaxSize),
		mimeType: params.mimeType !== undefined
			? toRegExp(params.mimeType)
			: undefined,
	}),
);

export function asFormData<
	GenericShape extends DP.DataParserObjectShape,
>(
	shape: GenericShape,
	params: AsFormDataParams,
) {
	return _asFormData(
		DP.object(shape),
		params,
	);
}
