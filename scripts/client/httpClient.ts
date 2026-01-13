import { type RemoveKind, type Kind, type MaybeArray, type MayBeGetter } from "@duplojs/utils";
import * as OO from "@duplojs/utils/object";
import * as GG from "@duplojs/utils/generator";
import { createClientKind } from "./kind";
import { type ClientRequestParams, type ClientRequestInitParams, type Hooks } from "./types";
import { PromiseRequest } from "./promiseRequest";

export const httpClientKind = createClientKind("http-client");

export interface HttpCLient extends Kind<typeof httpClientKind.definition> {
	readonly baseUrl: string;
	readonly hooks: Hooks;
	readonly defaultHeaders: Map<string, () => (MaybeArray<string> | undefined | null)>;

	addDefaultHeader(
		headerName: string,
		headerValue: MayBeGetter<MaybeArray<string> | undefined | null>
	): void;

	addDefaultHeaders(
		headers: Record<
			string,
			MayBeGetter<MaybeArray<string> | undefined | null>
		>
	): void;

	request<
		GenericClientRequestParams extends ClientRequestParams,
	>(
		params: GenericClientRequestParams
	): PromiseRequest;
}

export interface CreateHttpClientParams {
	readonly baseUrl: string;
	readonly hooks?: Partial<Hooks>;
	readonly credentials?: ClientRequestInitParams["credentials"];
	readonly cache?: ClientRequestInitParams["cache"];
}

export function createHttpClient(clientParams: CreateHttpClientParams): HttpCLient {
	const hooks = OO.override<Hooks>(
		{
			request: [],
			response: [],
			information: {},
			code: {},
			informationalResponseType: [],
			successfulResponseType: [],
			redirectionResponseType: [],
			clientErrorResponseType: [],
			serverErrorResponseType: [],
			expectedResponse: [],
			error: [],
		},
		clientParams.hooks ?? {},
	);

	const defaultHeaders: HttpCLient["defaultHeaders"] = new Map();

	return httpClientKind.setTo(
		{
			...clientParams,
			hooks,
			defaultHeaders,
			addDefaultHeader(headerName, headerValue) {
				defaultHeaders.set(
					headerName,
					typeof headerValue === "function"
						? headerValue
						: () => headerValue,
				);
			},
			addDefaultHeaders(headers) {
				for (const [header, headerValue] of OO.entries(headers)) {
					defaultHeaders.set(
						header,
						typeof headerValue === "function"
							? headerValue
							: () => headerValue,
					);
				}
			},
			request(params) {
				const headers = GG.reduce(
					defaultHeaders.entries(),
					GG.reduceFrom<ClientRequestParams["headers"]>({}),
					({ element, lastValue, next }) => {
						lastValue[element[0]] = element[1]();

						return next(lastValue);
					},
				);

				return new PromiseRequest({
					...params,
					headers: {
						...params.headers,
						...headers,
					},
					initParams: {
						...params.initParams,
						credentials: params.initParams.credentials ?? clientParams.credentials,
						cache: params.initParams.cache ?? clientParams.cache,
					},
				});
			},
		} satisfies RemoveKind<HttpCLient>,
	);
}
