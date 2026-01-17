import { kindHeritage, O, type S } from "@duplojs/utils";
import { createCoreLibKind } from "../kind";

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

	public setHeaders(headers: Partial<Record<string, string | string[]>>) {
		this.headers = O.override(
			this.headers ?? {},
			headers,
		);

		return this;
	}

	public setHeader(key: string, header?: string | string[]) {
		if (!this.headers) {
			this.headers = {};
		}

		if (typeof header !== "undefined") {
			this.headers[key] = header;
		}

		return this;
	}

	public deleteHeader(key: string) {
		if (!this.headers) {
			return this;
		}

		const {
			[key]: deleteHeader,
			...rest
		} = this.headers;

		this.headers = rest;

		return this;
	}
}
