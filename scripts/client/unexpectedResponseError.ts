import { kindHeritage } from "@duplojs/utils";
import { createClientKind } from "./kind";
import { type ClientResponse, type ClientRequestParams } from "./types";

export interface ErrorContent {
	error: unknown;
	requestParams: ClientRequestParams;
}

export class UnexpectedInformationResponseError extends kindHeritage(
	"unexpected-information-response-error",
	createClientKind("unexpected-information-response-error"),
	Error,
) {
	public constructor(
		public information: string | string[],
		public response: ErrorContent | ClientResponse,
	) {
		super({}, ["Unexpected information response."]);
	}
}

export class UnexpectedCodeResponseError extends kindHeritage(
	"unexpected-code-response-error",
	createClientKind("unexpected-code-response-error"),
	Error,
) {
	public constructor(
		public code: string | string[],
		public response: ErrorContent | ClientResponse,
	) {
		super({}, ["Unexpected code response."]);
	}
}

export class UnexpectedResponseTypeError extends kindHeritage(
	"unexpected-response-type-error",
	createClientKind("unexpected-response-type-error"),
	Error,
) {
	public constructor(
		public expectType: "informational" | "successful" | "redirection" | "clientError" | "serverError",
		public response: ErrorContent | ClientResponse,
	) {
		super({}, ["Unexpected response type."]);
	}
}

export class UnexpectedResponseError extends kindHeritage(
	"unexpected-response-error",
	createClientKind("unexpected-response-error"),
	Error,
) {
	public constructor(
		public response: ErrorContent | ClientResponse,
	) {
		super({}, ["Unexpected response."]);
	}
}
