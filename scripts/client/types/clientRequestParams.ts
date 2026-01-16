import { type SimplifyTopLevel, type IsEqual, type MaybeArray, type AnyTuple, type Json } from "@duplojs/utils";
import { type ServerRouteHeaders, type ServerRouteParams, type ServerRouteQuery, type ServerRoute, type ServerPrimitiveData } from "./serverRoute";

export interface ClientRequestInitParams extends Pick<
	RequestInit,
	| "cache"
	| "credentials"
	| "integrity"
	| "keepalive"
	| "mode"
	| "redirect"
	| "referrer"
	| "referrerPolicy"
	| "signal"
> {

}

export type ClientRequestParamsHeaders = Record<string, string | undefined>;

export type ClientRequestParamsParams = Record<string, string | undefined>;

export type ClientRequestParamsQuery = Record<string, MaybeArray<string> | undefined>;

export type ClientRequestParamsBody = Json;

export interface ClientRequestParams<
	GenericHookParams extends Record<string, unknown> = Record<string, unknown>,
> {
	method: string;
	path: string;
	headers?: ClientRequestParamsHeaders;
	params?: ClientRequestParamsParams;
	query?: ClientRequestParamsQuery;
	body?: ClientRequestParamsBody;
	initParams?: ClientRequestInitParams;
	hookParams?: GenericHookParams;
}

type StringifyTuple<
	GenericTuple extends AnyTuple<ServerPrimitiveData>,
> = GenericTuple extends [
	infer InferredFirst extends ServerPrimitiveData,
	...infer InferredRest,
]
	? InferredRest extends readonly []
		? [`${InferredFirst}`]
		: InferredRest extends AnyTuple
			? StringifyTuple<InferredRest> extends infer InferredResult extends AnyTuple
				? [`${InferredFirst}`, ...InferredResult]
				: never
			: never
	: never;

export type ServerRouteToClientRequestParamsHeaders<
	GenericHeader extends ServerRouteHeaders | undefined,
> = GenericHeader extends ServerRouteHeaders
	? SimplifyTopLevel<{
		[Prop in keyof GenericHeader]: GenericHeader[Prop] extends infer InferredValue
			? InferredValue extends ServerPrimitiveData
				? InferredValue extends undefined
					? InferredValue
					: `${InferredValue}`
				: never
			: never
	}>
	: GenericHeader;

export type ServerRouteToClientRequestParamsParams<
	GenericParams extends ServerRouteParams | undefined,
> = GenericParams extends ServerRouteParams
	? SimplifyTopLevel<{
		[Prop in keyof GenericParams]: GenericParams[Prop] extends infer InferredValue
			? InferredValue extends ServerPrimitiveData
				? InferredValue extends undefined
					? InferredValue
					: `${InferredValue}`
				: never
			: never
	}>
	: GenericParams;

export type ServerRouteToClientRequestParamsQuery<
	GenericQuery extends ServerRouteQuery | undefined,
> = GenericQuery extends ServerRouteQuery
	? SimplifyTopLevel<{
		[Prop in keyof GenericQuery]: GenericQuery[Prop] extends infer InferredValue
			? InferredValue extends MaybeArray<ServerPrimitiveData>
				? InferredValue extends undefined
					? InferredValue
					: InferredValue extends AnyTuple
						? StringifyTuple<InferredValue>
						: InferredValue extends readonly any[]
							? `${InferredValue[number]}`[]
							: InferredValue extends ServerPrimitiveData
								? `${InferredValue}`
								: never
				: never
			: never
	}>
	: GenericQuery;

export type ServerRouteToClientRequestParams<
	GenericServerRoute extends ServerRoute = ServerRoute,
	GenericHookParams extends Record<string, unknown> = Record<string, unknown>,
> = GenericServerRoute extends any
	? SimplifyTopLevel<(
		& {
			method: GenericServerRoute["method"];
			path: GenericServerRoute["path"];
			initParams?: ClientRequestInitParams;
			hookParams?: GenericHookParams;
		}
		& (
			IsEqual<GenericServerRoute["headers"], unknown> extends true
				? {}
				: {
					headers: ServerRouteToClientRequestParamsHeaders<
						GenericServerRoute["headers"]
					>;
				} extends infer InferredResult extends Record<string, unknown>
					? {} extends InferredResult["headers"]
						? Partial<InferredResult>
						: never
					: never
		)
		& (
			IsEqual<GenericServerRoute["params"], unknown> extends true
				? {}
				: {
					params: ServerRouteToClientRequestParamsParams<
						GenericServerRoute["params"]
					>;
				} extends infer InferredResult extends Record<string, unknown>
					? {} extends InferredResult["params"]
						? Partial<InferredResult>
						: never
					: never
		)
		& (
			IsEqual<GenericServerRoute["query"], unknown> extends true
				? {}
				: {
					query: ServerRouteToClientRequestParamsQuery<
						GenericServerRoute["query"]
					>;
				} extends infer InferredResult extends Record<string, unknown>
					? {} extends InferredResult["query"]
						? Partial<InferredResult>
						: never
					: never
		)
		& (
			IsEqual<GenericServerRoute["body"], unknown> extends true
				? {}
				: {
					body: GenericServerRoute["body"];
				} extends infer InferredResult extends Record<string, unknown>
					? {} extends InferredResult["headers"]
						? Partial<InferredResult>
						: never
					: never
		)
	)> extends infer InferredResult extends ClientRequestParams
		? InferredResult
		: never
	: never;
