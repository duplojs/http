import { kindHeritage, type S } from "@duplojs/utils";
import { createCoreLibKind } from "./kind";

export type InformationResponseCode = `1${S.Digit}${S.Digit}`;

export type SuccessResponseCode = `2${S.Digit}${S.Digit}`;

export type RedirectionResponseCode = `3${S.Digit}${S.Digit}`;

export type ClientErrorResponseCode = `4${S.Digit}${S.Digit}`;

export type ServerErrorResponseCode = `5${S.Digit}${S.Digit}`;

export type ResponseCode = (
	| InformationResponseCode
	| SuccessResponseCode
	| RedirectionResponseCode
	| ClientErrorResponseCode
	| ServerErrorResponseCode
);

export class Response<
	GenericCode extends ResponseCode = ResponseCode,
	GenericInformation extends string = string,
	GenericBody extends unknown = unknown,
> extends kindHeritage(
		"response",
		createCoreLibKind("response"),
	) {
	public code: GenericCode;

	public information: GenericInformation;

	public body: GenericBody;

	public headers: Record<string, string | string[]> | undefined = undefined;

	public constructor(
		code: GenericCode,
		information: GenericInformation,
		body: GenericBody,
	) {
		super();

		this.code = code;
		this.information = information;
		this.body = body;
	}
}
