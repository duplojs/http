import type * as SS from "@duplojs/utils/string";
import { type ServerRouteResponse, type ServerRoute } from "./serverRoute";
import { type MaybePromise, type IsEqual, type SimplifyTopLevel, type NeverCoalescing } from "@duplojs/utils";
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

export interface ClientEventsResponseHandler<
	GenericServerEvent extends ServerEvent = ServerEvent,
> extends AsyncIterable<GenericServerEvent, void> {
	closeEventStream(): void;
	onReceiveEvent<
		GenericEventName extends GenericServerEvent["event"],
	>(
		name: GenericEventName,
		callback: (
			event: NeverCoalescing<
				Extract<GenericServerEvent, { event: GenericEventName }>,
				ServerEvent
			>,
			response: this
		) => MaybePromise<void>
	): this;
	onStreamEvent(event: "close", callback: (response: this) => MaybePromise<void>): this;
	onStreamEvent(event: "beforeRetry", callback: (response: this) => MaybePromise<void>): this;
	onStreamEvent(event: "error", callback: (error: unknown, response: this) => MaybePromise<void>): this;
	onStreamEvent(event: "start", callback: (response: this) => MaybePromise<void>): this;
	onStreamEvent(event: "receiveServerEvents", callback: (event: GenericServerEvent, response: this) => MaybePromise<void>): this;
	consumeEventStream(): Promise<void>;
}

export interface ClientEventsResponse<
	GenericHookParams extends Record<string, unknown> = Record<string, unknown>,
> extends ClientResponse<GenericHookParams>, ClientEventsResponseHandler {

}

export type AllClientResponse<
	GenericHookParams extends Record<string, unknown> = Record<string, unknown>,
> = (
	| ClientResponse<GenericHookParams>
	| ClientEventsResponse<GenericHookParams>
);

export interface NotPredictedClientResponse<
	GenericHookParams extends Record<string, unknown> = Record<string, unknown>,
> extends ClientResponse<GenericHookParams> {
	predicted: false;
}

export interface NotPredictedClientEventsResponse<
	GenericHookParams extends Record<string, unknown> = Record<string, unknown>,
> extends NotPredictedClientResponse<GenericHookParams>, ClientEventsResponseHandler {

}

export type AllNotPredictedClientResponse<
	GenericHookParams extends Record<string, unknown> = Record<string, unknown>,
> = (
	| NotPredictedClientResponse<GenericHookParams>
	| NotPredictedClientEventsResponse<GenericHookParams>
);

export type ServerRouteToClientResponse<
	GenericServerRoute extends ServerRoute = ServerRoute,
	GenericHookParams extends Record<string, unknown> = Record<string, unknown>,
> = GenericServerRoute extends any
	? GenericServerRoute["responses"] extends infer InferredResponse
		? InferredResponse extends ServerRouteResponse
			? (
				SimplifyTopLevel<{
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
				}>
				& (
					IsEqual<InferredResponse["events"], unknown> extends true
						? unknown
						: InferredResponse["events"] extends object
							? ClientEventsResponseHandler<{
								[EventName in keyof InferredResponse["events"]]: EventName extends string
									? {
										event: EventName;
										data: InferredResponse["events"][EventName];
										id?: string;
										retry?: number;
									}
									: never
							}[keyof InferredResponse["events"]]>
							: unknown
				)
			) extends infer InferredResult extends ClientResponse
				? InferredResult
				: never
			: never
		: never
	: never;
