import { type ClientRequestParams } from "./clientRequestParams";
import type * as SS from "@duplojs/utils/string";

export interface ClientResponse {
	code: SS.Number;
	information: undefined | string;
	body: unknown;
	ok: boolean | null;
	headers: Headers;
	type: ResponseType;
	url: string;
	redirected: boolean;
	raw: globalThis.Response;
	requestParams: ClientRequestParams;
}
