import { stringToBytes, type BytesInString } from "@duplojs/utils";
import { type BodyControllerParams, createBodyController } from "./base";

export interface TextBodyReaderParams extends BodyControllerParams {

}

export const TextBodyController = createBodyController<
	"text",
	TextBodyReaderParams
>("text");
export type TextBodyController = typeof TextBodyController;

export interface ControlBodyAsTextParams {
	bodyMaxSize?: number | BytesInString;
}

export function controlBodyAsText(
	params?: ControlBodyAsTextParams,
) {
	return TextBodyController.create({
		bodyMaxSize: params?.bodyMaxSize && stringToBytes(params.bodyMaxSize),
	});
}
