import { stringToBytes, toRegExp, type BytesInString } from "@duplojs/utils";
import { type BodyControllerParams, createBodyController } from "./base";

export interface FormDataBodyReaderParams extends BodyControllerParams {
	maxFileQuantity: number;
	mimeType?: RegExp;
	fileMaxSize?: number;
	maxBufferSize: number;
	maxIndexArray: number;
	maxKeyLength: number;
}

export const FormDataBodyController = createBodyController<
	"formData",
	FormDataBodyReaderParams
>("formData");
export type FormDataBodyController = typeof FormDataBodyController;

export interface ControlBodyAsFormDataParams {
	maxFileQuantity: number;
	mimeType?: string | string[] | RegExp;
	bodyMaxSize?: number | BytesInString;
	fileMaxSize?: number | BytesInString;
	maxBufferSize?: number | BytesInString;
	maxIndexArray?: number;
	maxKeyLength?: number;
}

export function controlBodyAsFormData(
	params: ControlBodyAsFormDataParams,
) {
	return FormDataBodyController.create({
		maxFileQuantity: params.maxFileQuantity,
		bodyMaxSize: params.bodyMaxSize && stringToBytes(params.bodyMaxSize),
		fileMaxSize: params.fileMaxSize && stringToBytes(params.fileMaxSize),
		mimeType: params.mimeType !== undefined
			? toRegExp(params.mimeType)
			: undefined,
		maxBufferSize: params.maxBufferSize !== undefined
			? stringToBytes(params.maxBufferSize)
			: stringToBytes("128kb"),
		maxIndexArray: params.maxIndexArray !== undefined
			? params.maxIndexArray
			: 500,
		maxKeyLength: params.maxKeyLength !== undefined
			? params.maxKeyLength
			: 500,
	});
}
