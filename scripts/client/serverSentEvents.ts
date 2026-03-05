import { pipe, sleep } from "@duplojs/utils";
import * as GG from "@duplojs/utils/generator";
import * as SS from "@duplojs/utils/string";
import { type ServerEvent, type ClientEventsResponse, type ClientResponse } from "./types";

interface RawServerEvent {
	data: string | null;
	event: string | null;
	id?: string;
	retry?: number;
	"content-type"?: string;
}

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

	if (!reader || response.code === "204") {
		return {
			...response,
			[Symbol.asyncIterator]: async function *() {},
		};
	}

	let lastId = response.requestParams.headers?.["last-event-id"];
	let retry = 0;

	const eventsFluxReader = () => pipe(
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
						await sleep(retry);
						abortController = new AbortController();
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

						if (fetchResponse.status === 204) {
							return exit();
						}

						const fetchInformation = fetchResponse.headers.get("content-type");
						if (
							response.headers.get("content-type")?.includes("text/event-stream")
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
						}

						return next();
					}
				} catch {
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

				while (SS.test(buffer, endMessageRegexp)) {
					const [first, seconde = ""] = SS.split(buffer, endMessageRegexp, { limit: 2 });
					buffer = seconde;

					if (first) {
						yield first;
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
					GG.reduceFrom<RawServerEvent>({
						data: null,
						event: null,
					}),
					({ lastValue, element, nextWithObject }) => {
						const { field, value } = element.namedGroups as {
							field: keyof RawServerEvent | "content-type";
							value: string;
						};

						if (field === "data") {
							return nextWithObject(
								lastValue,
								{
									[field]: lastValue.data === null
										? value
										: `${lastValue.data}\n${value}`,
								},
							);
						}

						if (field === "retry") {
							return nextWithObject(
								lastValue,
								{
									[field]: SS.test(value, validRetryRegexp)
										? parseInt(value, 10)
										: undefined,
								},
							);
						}

						return nextWithObject(
							lastValue,
							{ [field]: value },
						);
					},
				);

				if (
					typeof eventContent.id === "string"
					&& !SS.test(eventContent.id, nullIdRegexp)
				) {
					lastId = eventContent.id;
				}

				if (typeof eventContent.retry === "number" && !isNaN(eventContent.retry)) {
					retry = eventContent.retry;
				}

				if (eventContent.data === null) {
					continue;
				}

				yield {
					event: eventContent.event || "message",
					data: eventContent["content-type"]?.includes("application/json")
						? JSON.parse(eventContent.data)
						: eventContent.data,
					id: eventContent.id,
					retry: eventContent.retry,
				} satisfies ServerEvent;
			}
		},
	);

	return {
		...response,
		[Symbol.asyncIterator]: eventsFluxReader,
	};
}
