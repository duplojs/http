import { type RequestInitializationData, Request } from "@core";
import httpMocks from "node-mocks-http";
import type http from "http";
import FormData from "form-data";
import { type SimplifyTopLevel } from "@duplojs/utils";

type InitializationData = SimplifyTopLevel<
	& Omit<Partial<RequestInitializationData>, "raw">
	& { body?: unknown }
	& {
		raw?: {
			request?: httpMocks.RequestOptions;
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

	request.pipe = (writable) => {
		const body = raw?.request?.body;
		if (body instanceof FormData) {
			body.pipe(writable);
		}

		return writable;
	};

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
		...initializationData,
	}) as Request & {
		raw: {
			request: typeof request;
			response: typeof response;
		};
	};
}
