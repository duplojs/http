/* eslint-disable @typescript-eslint/prefer-for-of */
import { type MaybePromise, type AnyTuple } from "@duplojs/utils";

export namespace Stream {
	export interface StartSendingParams<
		GenericFlux extends unknown = unknown,
	> {
		send(
			...args: AnyTuple<GenericFlux>
		): Promise<void>;
		abort(): void;
		onAbort(theFunction: () => void): void;
		isAbort(): boolean;
		close(): void;
		onClose(theFunction: () => void): void;
		isClose(): boolean;
		error(error: unknown): void;
		onError(theFunction: (error: unknown) => void): void;
	}

	export interface Handler {
		start(
			send: (value: unknown) => Promise<void>,
			close: () => void
		): Promise<void>;
		abort(): void;
	}

	export function init(
		startStream: (
			params: StartSendingParams
		) => MaybePromise<void>,
	) {
		const abortSubscribers: Parameters<StartSendingParams["onAbort"]>[0][] = [];
		let isAbort = false;

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
					send: async(...args) => {
						if (isClose) {
							return Promise.resolve();
						} else if (isAbort) {
							return Promise.resolve();
						}

						for (let index = 0; index < args.length; index++) {
							await send(args[index]!);
						}
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
				};

				try {
					await startStream(params);
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
				for (let index = 0; index < abortSubscribers.length; index++) {
					abortSubscribers[index]!();
				}
			},
		};

		return handler;
	}
}
