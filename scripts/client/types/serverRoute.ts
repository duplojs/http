import { type MaybeArray } from "@duplojs/utils";
import type * as SS from "@duplojs/utils/string";

export type ServerPrimitiveData = string | undefined | number | null | boolean;

export type ServerRouteHeaders = Record<string, ServerPrimitiveData>;

export type ServerRouteParams = Record<string, ServerPrimitiveData>;

export type ServerRouteQuery = Record<string, MaybeArray<ServerPrimitiveData>>;

export type ServerRouteBody = unknown;

export type ServerRouteResponseBody = unknown;

export interface ServerRouteResponse {
	code: SS.Number;
	information?: string;
	body?: ServerRouteResponseBody;
}

export interface ServerRoute {
	path: string;
	method: string;
	headers?: ServerRouteHeaders;
	params?: ServerRouteParams;
	query?: ServerRouteQuery;
	body?: ServerRouteBody;
	responses: ServerRouteResponse;
}
