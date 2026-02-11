import { stringToBytes, type BytesInString } from "@duplojs/utils";
import { type BodyControllerParams, createBodyController } from "./base";

export interface TextBodyReaderParams extends BodyControllerParams {

}

export const TextController = createBodyController<
	"text",
	TextBodyReaderParams
>("text");
export type TextController = typeof TextController;

export interface ControlBodyAsTextParams {
	bodyMaxSize?: number | BytesInString;
}

export function controlBodyAsText(
	params?: ControlBodyAsTextParams,
) {
	return TextController.create({
		bodyMaxSize: params?.bodyMaxSize && stringToBytes(params.bodyMaxSize),
	});
}
