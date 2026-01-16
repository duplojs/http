import { type Json, type MaybeArray } from "@duplojs/utils";

export type ServerPrimitiveData = string | undefined | number | null | boolean;

export type ServerRouteHeaders = Record<string, ServerPrimitiveData>;

export type ServerRouteParams = Record<string, ServerPrimitiveData>;

export type ServerRouteQuery = Record<string, MaybeArray<ServerPrimitiveData>>;

export type ServerRouteBody = Json;

export type ServerRouteResponseBody = Json;

export interface ServerRouteResponse {
	code: string;
	information?: string;
	body?: ServerRouteResponseBody;
	fromHook?: true;
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
