import { stringToBytes, toRegExp, type BytesInString } from "@duplojs/utils";
import { type BodyControllerParams, createBodyController } from "./base";

export interface FormDataBodyReaderParams extends BodyControllerParams {
	maxFileQuantity: number;
	mimeType?: RegExp;
	fileMaxSize?: number;
}

export const FormDataController = createBodyController<
	"formData",
	FormDataBodyReaderParams
>("formData");
export type FormDataController = typeof FormDataController;

export interface ControlBodyAsFormDataParams {
	maxFileQuantity: number;
	mimeType?: string | string[] | RegExp;
	bodyMaxSize?: number | BytesInString;
	fileMaxSize?: number | BytesInString;
}

export function controlBodyAsFormData(
	params: ControlBodyAsFormDataParams,
) {
	return FormDataController.create({
		maxFileQuantity: params.maxFileQuantity,
		bodyMaxSize: params.bodyMaxSize && stringToBytes(params.bodyMaxSize),
		fileMaxSize: params.fileMaxSize && stringToBytes(params.fileMaxSize),
		mimeType: params.mimeType !== undefined
			? toRegExp(params.mimeType)
			: undefined,
	});
}
