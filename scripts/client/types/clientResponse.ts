import { type ClientRequestParams } from "./clientRequestParams";
import type * as SS from "@duplojs/utils/string";
import { type ServerRouteResponse, type ServerRoute } from "./serverRoute";
import { type Json, type IsEqual, type SimplifyTopLevel } from "@duplojs/utils";

export type ClientResponseBody = Json;

export interface ClientResponse {
	code: SS.Number;
	information: undefined | string;
	body: ClientResponseBody;
	fromHook?: true;
	ok: boolean | null;
	headers: Headers;
	type: ResponseType;
	url: string;
	redirected: boolean;
	raw: globalThis.Response;
	requestParams: ClientRequestParams;
}

export type ServerRouteToClientResponse<
	GenericServerRoute extends ServerRoute = ServerRoute,
> = GenericServerRoute extends any
	? GenericServerRoute["responses"] extends infer InferredResponse
		? InferredResponse extends ServerRouteResponse
			? SimplifyTopLevel<(
				& {
					code: InferredResponse["code"];
					information: InferredResponse["information"];
					body: InferredResponse["body"];
					ok: boolean | null;
					headers: Headers;
					type: ResponseType;
					url: string;
					redirected: boolean;
					raw: globalThis.Response;
					requestParams: ClientRequestParams;
				}
				& (
					IsEqual<InferredResponse["fromHook"], unknown> extends true
						? {}
						: { fromHook: InferredResponse["fromHook"] }
				)
			)> extends infer InferredResult extends ClientResponse
				? InferredResult
				: never
			: never
		: never
	: never;
