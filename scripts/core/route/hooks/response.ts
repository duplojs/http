import { createCoreLibKind } from "@core/kind";
import { type ResponseCode, Response } from "@core/response";
import { kindHeritage } from "@duplojs/utils";

export class HookResponse<
	GenericCode extends ResponseCode = ResponseCode,
	GenericInformation extends string = string,
	GenericBody extends unknown = unknown,
> extends kindHeritage(
		"hook-response",
		createCoreLibKind("hook-response"),
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
		super({}, [undefined, undefined, undefined]);

		this.code = code;
		this.information = information;
		this.body = body;
	}
}
