/* eslint-disable @typescript-eslint/prefer-for-of */
import { type MaybePromise, type MillisecondInString, stringToMillisecond } from "@duplojs/utils";
import { Stream } from "./stream";

export namespace ServerSentEvents {
	export type DefinitionShape = [string, unknown];

	export interface SendParams {
		id?: string;
		retry?: number | MillisecondInString;
	}

	export interface StartSendingParams<
		GenericEvents extends DefinitionShape = DefinitionShape,
	> extends Stream.StartSendingParams {
		send(
			...args: GenericEvents extends any
				? [
					event: GenericEvents[0],
					...(
						GenericEvents[1] extends undefined
							? [data?: GenericEvents[1]]
							: [data: GenericEvents[1]]
					),
					params?: SendParams,
				]
				: never
		): Promise<void>;
		readonly lastId: string | null;
	}

	export interface InitParams {
		readonly lastId: string | null;
	}

	const regexServerSentEventSplitStringData = /\r\n|\r|\n/;
	const nullIdRegexp = /\0|\n|\r/;
	export function init(
		startSendingEvents: (
			params: StartSendingParams
		) => MaybePromise<void>,
		initParams: InitParams,
	) {
		return Stream.init(
			(streamParams) => startSendingEvents({
				...streamParams,
				lastId: initParams.lastId,
				send: (event, data, params) => {
					if (streamParams.isClose()) {
						return Promise.resolve();
					} else if (streamParams.isAbort()) {
						return Promise.resolve();
					}
					let content = `event: ${event || "message"}\n`;
					if (typeof data === "string") {
						const splitData = data.split(regexServerSentEventSplitStringData);
						for (let index = 0; index < splitData.length; index++) {
							content += `data: ${splitData[index]}\n`;
						}
					} else if (data !== undefined) {
						content += `content-type: application/json\ndata: ${JSON.stringify(data)}\n`;
					}

					if (typeof params?.id === "string" && !nullIdRegexp.test(params.id)) {
						content += `id: ${params.id}\n`;
					}

					if (params?.retry !== undefined) {
						content += `retry: ${stringToMillisecond(params.retry)}\n`;
					}

					content += "\n";

					return streamParams.send(content);
				},
			}),
		);
	}
}
