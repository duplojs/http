import * as GG from "@duplojs/utils/generator";
import { launchCloseStreamHook, launchErrorStreamHook, launchReceiveDataStreamHook, launchStartStreamHook } from "./hooks";
import { type CloseStreamHook, type ErrorStreamHook, type ReceiveDataStreamHook, type StartStreamHook, type ClientResponse, type ClientStreamResponse, type AllClientResponse, type ServerRouteResponseFlux } from "./types";

const closeReason = Symbol("CloseReason");
export function makeClientStreamResponse(
	response: ClientResponse,
): ClientStreamResponse {
	const reader = response.raw.body?.getReader();
	const abortController = response.requestParams.abortController;

	const createStreamResponse = (
		streamReaderGenerator: (
			emitError: (error: unknown) => Promise<void>,
		) => AsyncGenerator<ServerRouteResponseFlux>,
	): ClientStreamResponse => {
		let closeStream: CloseStreamHook[] | undefined = undefined;
		let receiveDataStream: ReceiveDataStreamHook[] | undefined = undefined;
		let errorStream: ErrorStreamHook[] | undefined = undefined;
		let startStream: StartStreamHook[] | undefined = undefined;

		const streamResponse: ClientStreamResponse = {
			...response,
			handlerType: "stream",
			onStream: (event, callback) => {
				if (event === "close") {
					closeStream ??= [];
					closeStream.push(callback as never);
				} else if (event === "receiveData") {
					receiveDataStream ??= [];
					receiveDataStream.push(callback as never);
				} else if (event === "error") {
					errorStream ??= [];
					errorStream.push(callback as never);
				} else if (event === "start") {
					startStream ??= [];
					startStream.push(callback as never);
				}

				return streamResponse;
			},
			closeStream: () => void abortController.abort(closeReason),
			consumeStream: async() => {
				for await (const __ of streamResponse) { }
			},
			[Symbol.asyncIterator]: async function *() {
				await launchStartStreamHook(
					response.requestParams.hooks.startStream,
					startStream ?? [],
					streamResponse,
				).catch(console.error);

				const onError = (error: unknown) => launchErrorStreamHook(
					response.requestParams.hooks.errorStream,
					errorStream ?? [],
					error,
					streamResponse,
				).catch(console.error);

				const generator = streamReaderGenerator(
					onError,
				);

				try {
					for await (const event of generator) {
						await launchReceiveDataStreamHook(
							response.requestParams.hooks.receiveDataStream,
							receiveDataStream ?? [],
							event,
							streamResponse,
						).catch(console.error);

						yield event;
					}
				} finally {
					await launchCloseStreamHook(
						response.requestParams.hooks.closeStream,
						closeStream ?? [],
						streamResponse,
					).catch(console.error);
				}
			},
		};

		return streamResponse;
	};

	if (!reader || response.code === "204") {
		return createStreamResponse(
			async function *() {},
		);
	}

	const textDecoder = response.headers.get("content-type")?.includes("text") && new TextDecoder("utf-8");

	return createStreamResponse(
		(emitError) => GG.asyncLoop(
			async({ next, exit }: GG.GeneratorLoopParams<unknown>) => {
				try {
					if (abortController.signal.aborted) {
						return exit();
					}

					const result = await reader.read();

					if (textDecoder) {
						const chunk = textDecoder.decode(result.value, { stream: true }) || undefined;

						if (result.done) {
							return exit(
								`${chunk ?? ""}${textDecoder.decode()}` || undefined,
							);
						}

						return next(chunk);
					} else if (result.done) {
						return exit(result.value);
					} else {
						return next(result.value);
					}
				} catch (error) {
					if (error !== closeReason) {
						await emitError(error);
					}

					return exit();
				}
			},
		),
	);
}

export function isClientStreamResponse<
	GenericResponse extends AllClientResponse,
>(response: GenericResponse): response is Extract<GenericResponse, ClientStreamResponse> {
	return Symbol.asyncIterator in response && response.handlerType === "stream";
}
