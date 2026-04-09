import { pipe, sleep } from "@duplojs/utils";
import * as GG from "@duplojs/utils/generator";
import * as SS from "@duplojs/utils/string";
import * as AA from "@duplojs/utils/array";
import { type ServerEvent, type ClientEventsResponse, type ClientResponse, type CloseServerEventHook, type BeforeRetryServerEventHook, type ErrorServerEventHook, type StartServerEventHook, type ReceiveEventServerEventHook, type AllClientResponse } from "./types";
import { launchBeforeRetryServerEventHook, launchCloseServerEventHook, launchErrorServerEventHook, launchReceiveEventServerEventHook, launchStartServerEventHook } from "./hooks";

interface RawServerEvent {
	data?: string;
	event?: string;
	id?: string;
	retry?: number;
	"content-type"?: string;
}

const closeReason = Symbol("CloseReason");
const endMessageRegexp = /\n\n|\r\r|\r\n\r\n/;
const eventPayloadRegexp = /^(?<field>event|data|id|retry|content-type): ?(?<value>.*)$/gm;
const validRetryRegexp = /^[0-9]+$/;
const nullIdRegexp = /\0|\n|\r/;
export function makeClientEventsResponse(
	response: ClientResponse,
	fetchUrl: string,
	fetchInitParams: RequestInit,
): ClientEventsResponse {
	let reader = response.raw.body?.getReader();
	let abortController = response.requestParams.abortController;

	const createEventResponse = (
		eventsReaderGenerator: (
			emitError: (error: unknown) => Promise<void>,
			emitBeforeRetry: () => Promise<void>
		) => AsyncGenerator<ServerEvent, void, unknown>,
	): ClientEventsResponse => {
		let closeServerEvent: CloseServerEventHook[] | undefined = undefined;
		let beforeRetryServerEvent: BeforeRetryServerEventHook[] | undefined = undefined;
		let errorServerEvent: ErrorServerEventHook[] | undefined = undefined;
		let startServerEvent: StartServerEventHook[] | undefined = undefined;
		let receiveEventServerEvent: ReceiveEventServerEventHook[] | undefined = undefined;

		const eventResponse: ClientEventsResponse = {
			...response,
			handlerType: "events",
			onStreamEvent: (event, callback) => {
				if (event === "receiveServerEvents") {
					receiveEventServerEvent ??= [];
					receiveEventServerEvent.push(callback as never);
				} else if (event === "beforeRetry") {
					beforeRetryServerEvent ??= [];
					beforeRetryServerEvent.push(callback as never);
				} else if (event === "close") {
					closeServerEvent ??= [];
					closeServerEvent.push(callback as never);
				} else if (event === "start") {
					startServerEvent ??= [];
					startServerEvent.push(callback as never);
				} else if (event === "error") {
					errorServerEvent ??= [];
					errorServerEvent.push(callback as never);
				}

				return eventResponse;
			},
			onReceiveEvent: (eventName, callback) => {
				receiveEventServerEvent ??= [];
				receiveEventServerEvent.push(
					(receiveEvent) => receiveEvent.event === eventName
						? callback(receiveEvent as never, eventResponse)
						: undefined,
				);
				return eventResponse;
			},
			closeEventStream: () => {
				abortController.abort(closeReason);
				void reader?.cancel(closeReason);
			},
			consumeEventStream: async() => {
				for await (const __ of eventResponse) { }
			},
			[Symbol.asyncIterator]: async function *() {
				await launchStartServerEventHook(
					response.requestParams.hooks.startServerEvent,
					startServerEvent ?? [],
					eventResponse,
				).catch(console.error);

				const onError = (error: unknown) => launchErrorServerEventHook(
					response.requestParams.hooks.errorServerEvent,
					errorServerEvent ?? [],
					error,
					eventResponse,
				).catch(console.error);

				const generator = eventsReaderGenerator(
					onError,
					() => launchBeforeRetryServerEventHook(
						response.requestParams.hooks.beforeRetryServerEvent,
						beforeRetryServerEvent ?? [],
						eventResponse,
					).catch(console.error),
				);

				try {
					for await (const event of generator) {
						await launchReceiveEventServerEventHook(
							response.requestParams.hooks.receiveEventServerEvent,
							receiveEventServerEvent ?? [],
							event,
							eventResponse,
						).catch(console.error);

						yield event;
					}
				} finally {
					await launchCloseServerEventHook(
						response.requestParams.hooks.closeServerEvent,
						closeServerEvent ?? [],
						eventResponse,
					).catch(console.error);
				}
			},
		};

		return eventResponse;
	};

	if (!reader || response.code === "204") {
		return createEventResponse(
			async function *() {},
		);
	}

	return createEventResponse(
		(emitError, emitBeforeRetry) => {
			let lastId = response.requestParams.headers?.["last-event-id"];
			let retry = 3000;

			return pipe(
				GG.asyncLoop(
					async({ next, exit }: GG.GeneratorLoopParams<ReadableStreamReadResult<Uint8Array>>) => {
						try {
							if (abortController.signal.aborted) {
								return exit();
							} else if (reader) {
								const chunk = await reader.read();
								if (chunk.done) {
									reader = undefined;
								}

								return next(chunk);
							} else {
								abortController = new AbortController();
								await sleep(retry);
								await emitBeforeRetry();
								const fetchResponse = await fetch(
									fetchUrl,
									{
										...fetchInitParams,
										headers: {
											...fetchInitParams.headers,
											...(
												typeof lastId === "string"
													? { "last-event-id": lastId }
													: undefined
											),
										},
										signal: abortController.signal,
									},
								);

								const fetchInformation = fetchResponse.headers.get(
									response.requestParams.informationHeaderKey,
								);
								if (
									fetchResponse.status !== 204
									&& fetchResponse.headers.get("content-type")?.includes("text/event-stream")
									&& fetchResponse.body
									&& (
										(
											fetchInformation === null
											&& response.information === undefined
										)
										|| fetchInformation === response.information
									)
								) {
									reader = fetchResponse.body.getReader();

									return next();
								}

								return exit();
							}
						} catch (error) {
							if (error !== closeReason) {
								await emitError(error);
							}
							reader = undefined;
							return next();
						}
					},
				),
				async function *(chunkGenerator) {
					const decoder = new TextDecoder("utf-8");
					let buffer = "";

					for await (const chunk of chunkGenerator) {
						buffer += decoder.decode(chunk.value, { stream: true });

						if (SS.test(buffer, endMessageRegexp)) {
							const events = SS.split(buffer, endMessageRegexp);
							buffer = AA.last(events);
							const restEvents = AA.pop(events);

							for (const event of restEvents) {
								yield event;
							}
						}

						if (chunk.done) {
							buffer = "";
						}
					}
				},
				async function *(chunkStringGenerator) {
					for await (const stringChunk of chunkStringGenerator) {
						const eventContent = GG.reduce(
							SS.extractAll(stringChunk, eventPayloadRegexp),
							GG.reduceFrom<RawServerEvent>({}),
							({ lastValue, element, next }) => {
								const { field, value } = element.namedGroups as {
									field: keyof RawServerEvent;
									value: string;
								};

								if (field === "data") {
									return next(
										{
											...lastValue,
											data: lastValue.data === undefined
												? value
												: `${lastValue.data}\n${value}`,
										},
									);
								} else if (field === "retry") {
									const retry = SS.test(value, validRetryRegexp)
										? parseInt(value, 10)
										: undefined;

									return next(
										{
											...lastValue,
											retry: typeof retry === "number" && !isNaN(retry)
												? retry
												: undefined,
										},
									);
								} else if (field === "id") {
									return next(
										{
											...lastValue,
											id: !SS.test(value, nullIdRegexp)
												? value
												: undefined,
										},
									);
								}

								return next(
									{
										...lastValue,
										[field]: value,
									},
								);
							},
						);

						if (typeof eventContent.id === "string") {
							lastId = eventContent.id;
						}

						if (typeof eventContent.retry === "number") {
							retry = eventContent.retry;
						}

						if (eventContent.data === undefined) {
							continue;
						}

						try {
							yield {
								event: eventContent.event || "message",
								data: eventContent["content-type"]?.includes("application/json")
									? JSON.parse(eventContent.data)
									: eventContent.data,
								id: eventContent.id,
								retry: eventContent.retry,
							} satisfies ServerEvent;
						} catch (error) {
							await emitError(error);
						}
					}
				},
			);
		},
	);
}

export function isClientEventsResponse<
	GenericResponse extends AllClientResponse,
>(response: GenericResponse): response is Extract<GenericResponse, ClientEventsResponse> {
	return Symbol.asyncIterator in response && response.handlerType === "events";
}
