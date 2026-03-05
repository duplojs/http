import type * as SS from "@duplojs/utils/string";
import { type ServerRouteResponse, type ServerRoute } from "./serverRoute";
import { type IsEqual, type SimplifyTopLevel } from "@duplojs/utils";
import { type PromiseRequestParams } from "./promiseRequestParams";

export type ClientResponseBody = unknown;

export interface ClientResponse<
	GenericHookParams extends Record<string, unknown> = Record<string, unknown>,
> {
	code: SS.Number;
	information: undefined | string;
	body: ClientResponseBody;
	ok: boolean | null;
	headers: Headers;
	type: ResponseType;
	url: string;
	redirected: boolean;
	raw: globalThis.Response;
	requestParams: PromiseRequestParams<GenericHookParams>;
	predicted: boolean;
}

export interface ServerEvent {
	data: unknown;
	event: string;
	id?: string;
	retry?: number;
}

export interface ClientEventsResponse<
	GenericHookParams extends Record<string, unknown> = Record<string, unknown>,
> extends ClientResponse<GenericHookParams>, AsyncIterable<ServerEvent, void> {

}

export interface NotPredictedClientResponse<
	GenericHookParams extends Record<string, unknown> = Record<string, unknown>,
> extends ClientResponse<GenericHookParams> {
	predicted: false;
}

export type ServerRouteToClientResponse<
	GenericServerRoute extends ServerRoute = ServerRoute,
	GenericHookParams extends Record<string, unknown> = Record<string, unknown>,
> = GenericServerRoute extends any
	? GenericServerRoute["responses"] extends infer InferredResponse
		? InferredResponse extends ServerRouteResponse
			? SimplifyTopLevel<{
				code: InferredResponse["code"];
				information: InferredResponse["information"];
				body: IsEqual<InferredResponse["body"], File> extends true
					? undefined
					: InferredResponse["body"];
				ok: boolean | null;
				headers: Headers;
				type: ResponseType;
				url: string;
				redirected: boolean;
				raw: globalThis.Response;
				requestParams: PromiseRequestParams<GenericHookParams>;
				predicted: boolean;
			}> extends infer InferredResult extends ClientResponse
				? InferredResult
				: never
			: never
		: never
	: never;
