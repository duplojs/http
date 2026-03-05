/* eslint-disable @typescript-eslint/prefer-for-of */
import { E, type MaybePromise, type MillisecondInString, stringToMillisecond } from "@duplojs/utils";
import { type ServerSentEventsPredictedResponse } from "./response";

export namespace ServerSentEvents {
	export type DefinitionShape = [string, unknown];
	export type SendUnknownError = E.Left<"unknown-error", unknown>;
	export type SendError = (
		| E.Left<"abort", unknown>
		| E.Left<"close", unknown>
		| SendUnknownError
	);

	export interface SendParams {
		id?: string;
		retry?: number | MillisecondInString;
	}

	export interface StartSendingParams<
		GenericEvents extends DefinitionShape = DefinitionShape,
	> {
		send(...args: [...GenericEvents, params?: SendParams]): void;
		abort(): void;
		onAbort(theFunction: () => void): void;
		isAbort(): boolean;
		close(): void;
		onClose(theFunction: () => void): void;
		isClose(): boolean;
		error(error: unknown): void;
		onError(theFunction: (error: unknown) => void): void;
		readonly lastId: string | null;
	}

	export interface Handler {
		start(
			send: (value: string) => void,
			close: () => void
		): MaybePromise<void>;
		abort(): void;
	}

	export interface InitParams {
		defaultIntervalPing: number;
		readonly lastId: string | null;
	}

	const regexServerSentEventSplitStringData = /\r\n|\r|\n/;
	const nullIdRegexp = /\0|\n|\r/;
	export function init(

		response: ServerSentEventsPredictedResponse,
		initParams: InitParams,
	) {
		const abortSubscribers: Parameters<StartSendingParams["onAbort"]>[0][] = [];
		let isAbort = false;
		let interval = undefined as number | undefined;

		const handler: Handler = {
			async start(
				send,
				close,
			) {
				if (isAbort) {
					return;
				}

				let isClose = false;

				const closeSubscribers: Parameters<StartSendingParams["onClose"]>[0][] = [];
				const errorSubscribers: Parameters<StartSendingParams["onError"]>[0][] = [];

				const params: StartSendingParams = {
					send: (event, data, params) => {
						if (isClose) {
							return E.left("close");
						} else if (isAbort) {
							return E.left("abort");
						}

						let content = `event: ${event || "message"}\n`;
						if (typeof data === "string") {
							const splitData = data.split(regexServerSentEventSplitStringData);
							for (let index = 0; index < splitData.length; index++) {
								content += `data: ${splitData[index]}\n`;
							}
						} else {
							content += `content-type: application/json\ndata: ${JSON.stringify(data)}\n`;
						}

						if (typeof params?.id === "string" && !nullIdRegexp.test(params.id)) {
							content += `id: ${params.id}\n`;
						}

						if (params?.retry !== undefined) {
							content += `retry: ${stringToMillisecond(params.retry)}\n`;
						}

						content += "\n";

						return void send(content);
					},
					abort: handler.abort,
					isAbort: () => isAbort,
					onAbort: (theFunction) => void abortSubscribers.push(theFunction),
					close: () => {
						if (isClose === true) {
							return;
						}
						isClose = true;
						close();
						clearInterval(interval);
						for (let index = 0; index < closeSubscribers.length; index++) {
							closeSubscribers[index]!();
						}
					},
					isClose: () => isClose,
					onClose: (theFunction) => void closeSubscribers.push(theFunction),
					error: (error: unknown) => {
						for (let index = 0; index < errorSubscribers.length; index++) {
							errorSubscribers[index]!(error);
						}
					},
					onError: (theFunction) => void errorSubscribers.push(theFunction),
					lastId: initParams.lastId && !nullIdRegexp.test(initParams.lastId)
						? initParams.lastId
						: null,
				};

				interval = setInterval(
					() => void params.send("ping", ""),
					stringToMillisecond(response.params?.intervalPing ?? initParams.defaultIntervalPing),
				) as unknown as number;

				try {
					await response.startSendingEvents(params);
				} catch (error) {
					params.error(error);
				} finally {
					params.close();
				}
			},
			abort() {
				if (isAbort === true) {
					return;
				}
				isAbort = true;
				clearInterval(interval);
				for (let index = 0; index < abortSubscribers.length; index++) {
					abortSubscribers[index]!();
				}
			},
		};

		return handler;
	}
}
