import { createCoreLibKind } from "@core/kind";
import { type ResponseCode, Response } from "@core/response";
import { kindHeritage } from "@duplojs/utils";
import { type HookRouteLifeCycle } from ".";

const defaultParamsParent: [undefined, undefined, undefined] = [undefined, undefined, undefined];
const defaultParams = {};

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

	public from: keyof HookRouteLifeCycle;

	public constructor(
		from: keyof HookRouteLifeCycle,
		code: GenericCode,
		information: GenericInformation,
		body: GenericBody,
	) {
		super(defaultParams, defaultParamsParent);

		this.code = code;
		this.information = information;
		this.body = body;
		this.from = from;

		this.setHeader("hook", from);
	}
}
