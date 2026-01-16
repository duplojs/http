import { type RemoveKind, type Kind, type MayBeGetter, type NeverCoalescing, type SimplifyTopLevel } from "@duplojs/utils";
import * as OO from "@duplojs/utils/object";
import * as GG from "@duplojs/utils/generator";
import { createClientKind } from "./kind";
import { type ClientRequestInitParams, type ServerRoute, type ServerRouteToClientRequestParams, type ServerRouteToClientResponse, type ClientRequestParamsHeaders, type ClientRequestParams } from "./types";
import { PromiseRequest } from "./promiseRequest";
import { type Hooks } from "./hooks";

export const httpClientKind = createClientKind("http-client");

type MaybeRequestParams<
	GenericRequestParams extends object,
> = {} extends GenericRequestParams
	? [params?: GenericRequestParams]
	: [params: GenericRequestParams];

export interface HttpCLient<
	GenericServerRoute extends ServerRoute = ServerRoute,
	GenericHookParams extends Record<string, unknown> = Record<string, unknown>,
> extends Kind<typeof httpClientKind.definition> {
	readonly baseUrl: string;
	readonly hooks: Hooks;
	readonly defaultHeaders: Map<string, () => (string | undefined | null)>;

	addDefaultHeader(
		headerName: string,
		headerValue: MayBeGetter<string | undefined | null>
	): void;

	addDefaultHeaders(
		headers: Record<
			string,
			MayBeGetter<string | undefined | null>
		>
	): void;

	request<
		GenericClientRequestParams extends ServerRouteToClientRequestParams<
			GenericServerRoute,
			GenericHookParams
		>,
	>(
		params: GenericClientRequestParams
	): PromiseRequest<
		ServerRouteToClientResponse<
			Extract<
				GenericServerRoute,
				{
					method: GenericServerRoute["method"];
					path: GenericServerRoute["path"];
				}
			>
		>
	>;

	get<
		GenericClientRequestParams extends NeverCoalescing<
			ServerRouteToClientRequestParams<
				Extract<GenericServerRoute, { method: "GET" }>,
				GenericHookParams
			>,
			ClientRequestParams<GenericHookParams>
		>,
		GenericPath extends GenericClientRequestParams["path"],
		GenericClientRequestRest extends SimplifyTopLevel<
			Omit<
				NeverCoalescing<
					Extract<
						GenericClientRequestParams,
						{ path: GenericPath }
					>,
					ClientRequestParams<GenericHookParams>
				>,
			"method" | "path"
			>
		>,
	>(
		path: GenericPath,
		...args: MaybeRequestParams<GenericClientRequestRest>
	): PromiseRequest<
		ServerRouteToClientResponse<
			Extract<
				GenericServerRoute,
				{
					method: GenericServerRoute["method"];
					path: GenericServerRoute["path"];
				}
			>
		>
	>;
}

export interface CreateHttpClientParams {
	readonly baseUrl: string;
	readonly hooks?: Partial<Hooks>;
	readonly credentials?: ClientRequestInitParams["credentials"];
	readonly cache?: ClientRequestInitParams["cache"];
}

export function createHttpClient<
	GenericServerRoute extends ServerRoute,
	GenericHookParams extends Record<string, unknown> = Record<string, unknown>,
>(
	clientParams: CreateHttpClientParams,
): HttpCLient<GenericServerRoute, GenericHookParams> {
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

	const self: HttpCLient = httpClientKind.setTo(
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
					GG.reduceFrom<ClientRequestParamsHeaders>({}),
					({ element, lastValue, next }) => {
						lastValue[element[0]] = `${element[1]()}`;

						return next(lastValue);
					},
				);

				return new PromiseRequest({
					hooks,
					baseUrl: clientParams.baseUrl,
					...params,
					headers: {
						...params.headers,
						...headers,
					},
					initParams: {
						...params.initParams,
						credentials: params.initParams?.credentials ?? clientParams.credentials,
						cache: params.initParams?.cache ?? clientParams.cache,
					},
				});
			},
			get: ((path: string, params?: object) => self.request({
				method: "GET",
				path,
				...params,
			})) as never,
		} satisfies RemoveKind<HttpCLient>,
	);

	return self;
}

const tt = createHttpClient({ baseUrl: "" }).get("/test");
