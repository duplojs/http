import { createCoreLibKind } from "@core/kind";
import { type ResponseCode, Response } from "@core/response";
import { kindHeritage } from "@duplojs/utils";

const defaultParamsParent: [undefined, undefined, undefined] = [undefined, undefined, undefined];
const defaultParams = {};

export class PredictedResponse<
	GenericCode extends ResponseCode = ResponseCode,
	GenericInformation extends string = string,
	GenericBody extends unknown = unknown,
> extends kindHeritage(
		"predicted-response",
		createCoreLibKind("predicted-response"),
		Response,
	) {
	public override code: GenericCode;

	public override information: GenericInformation;

	public override body: GenericBody;

	public constructor(
		code: GenericCode,
		information: GenericInformation,
		body: GenericBody,
	) {
		super(defaultParams, defaultParamsParent);

		this.code = code;
		this.information = information;
		this.body = body;
	}
}
