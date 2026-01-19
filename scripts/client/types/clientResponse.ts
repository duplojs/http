import type * as SS from "@duplojs/utils/string";
import { type ServerRouteResponse, type ServerRoute } from "./serverRoute";
import { type IsEqual, type SimplifyTopLevel } from "@duplojs/utils";
import { type PromiseRequestParams } from "@client/promiseRequest";

export type ClientResponseBody = unknown;

export interface ClientResponse<
	GenericPromiseRequestParams extends PromiseRequestParams = PromiseRequestParams,
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
	requestParams: GenericPromiseRequestParams;
	predicted: boolean;
}

export interface NotPredictedClientResponse<
	GenericPromiseRequestParams extends PromiseRequestParams = PromiseRequestParams,
> extends ClientResponse<GenericPromiseRequestParams> {
	predicted: false;
}

export type ServerRouteToClientResponse<
	GenericServerRoute extends ServerRoute = ServerRoute,
	GenericHookParams extends Record<string, unknown> = Record<string, unknown>,
> = IsEqual<GenericServerRoute, ServerRoute> extends true
	? ClientResponse<PromiseRequestParams<GenericHookParams>>
	: GenericServerRoute extends any
		? GenericServerRoute["responses"] extends infer InferredResponse
			? InferredResponse extends ServerRouteResponse
				? SimplifyTopLevel<{
					code: InferredResponse["code"];
					information: InferredResponse["information"];
					body: InferredResponse["body"];
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
