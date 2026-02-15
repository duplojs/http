/* eslint-disable require-yield */
/* eslint-disable @typescript-eslint/only-throw-error */
/* eslint-disable @typescript-eslint/require-await */
import { type RequestInitializationData, Request } from "@core";
import httpMocks from "node-mocks-http";
import type http from "http";
import { type SimplifyTopLevel } from "@duplojs/utils";
import { createBodyReader } from "@test-utils/bodyReader";

type InitializationData = SimplifyTopLevel<
	& Omit<Partial<RequestInitializationData>, "raw">
	& { body?: unknown }
	& {
		raw?: {
			request?: httpMocks.RequestOptions & {
				bodyChunks?: unknown;
				bodyIteratorError?: unknown;
				readableHighWaterMark?: number;
			};
			response?: httpMocks.ResponseOptions;
		};
	}
>;

export function createFakeRequest({ raw, ...initializationData }: InitializationData = {}) {
	const { req: request, res: response } = httpMocks.createMocks<
		http.IncomingMessage,
		http.ServerResponse
	>(
		raw?.request,
		raw?.response,
	);

	if (raw?.request?.readableHighWaterMark) {
		(request.readableHighWaterMark as any) = raw?.request?.readableHighWaterMark;
	}

	const bodyIteratorError = raw?.request?.bodyIteratorError;
	const explicitBodyChunks = raw?.request?.bodyChunks;
	const bodyChunks = explicitBodyChunks ?? raw?.request?.body;

	if (bodyIteratorError) {
		request[Symbol.asyncIterator] = async function *() {
			throw bodyIteratorError;
		};
	} else if (typeof (bodyChunks as never)?.[Symbol.asyncIterator] === "function") {
		request[Symbol.asyncIterator as never] = (bodyChunks as AsyncIterable<unknown>)[Symbol.asyncIterator]
			.bind(bodyChunks);
	} else if (typeof bodyChunks === "string" || Buffer.isBuffer(bodyChunks)) {
		request[Symbol.asyncIterator as never] = async function *() {
			yield await bodyChunks as never;
		};
	} else if (typeof (bodyChunks as never)?.[Symbol.iterator] === "function") {
		request[Symbol.asyncIterator as never] = async function *() {
			for (const chunk of bodyChunks as Iterable<unknown>) {
				yield chunk as never;
			}
		};
	} else if (bodyChunks !== undefined) {
		request[Symbol.asyncIterator as never] = async function *() {
			yield bodyChunks as any;
		};
	}

	return new Request({
		method: "GET",
		path: "/",
		headers: {},
		query: {},
		params: {},
		host: "",
		matchedPath: "/",
		origin: "",
		url: "",
		raw: {
			request,
			response,
		},
		bodyReader: createBodyReader(),
		...initializationData,
	}) as Request & {
		raw: {
			request: typeof request;
			response: typeof response;
		};
	};
}
