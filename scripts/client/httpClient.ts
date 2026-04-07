import { type RemoveKind, type Kind, type MayBeGetter, type SimplifyTopLevel, type IsEqual } from "@duplojs/utils";
import * as OO from "@duplojs/utils/object";
import * as GG from "@duplojs/utils/generator";
import { createClientKind } from "./kind";
import { type ClientRequestInitParams, type ServerRoute, type ServerRouteToClientRequestParams, type ServerRouteToClientResponse, type ClientRequestParamsHeaders, type ClientRequestParams, type Hooks, type RequestHook, type ResponseHook, type InformationHook, type CodeHook, type ResponseTypeHook, type ExpectedResponseHook, type NotPredictedResponseHook, type ErrorHook, type GetServerRoutePath, type AllClientResponse, type BeforeRetryServerEventHook, type CloseServerEventHook, type ErrorServerEventHook, type StartServerEventHook, type ReceiveEventServerEventHook, type ClientCacheInitialValues, type ClientCacheStore } from "./types";
import { PromiseRequest } from "./promiseRequest";
import { autoCreateCacheKey } from "./clientCache";

export const httpClientKind = createClientKind("http-client");

type MaybeRequestParams<
	GenericRequestParams extends object,
> = {} extends GenericRequestParams
	? [params?: GenericRequestParams]
	: [params: GenericRequestParams];

type HttpClientRequestMethod<
	GenericServerRoute extends ServerRoute,
	GenericHookParams extends Record<string, unknown>,
	GenericMethod extends string,
> = IsEqual<GenericServerRoute, ServerRoute> extends true
	? (
		path: string,
		params?: SimplifyTopLevel<
			Omit<
				ClientRequestParams<GenericHookParams>,
				"method" | "path"
			>
		>
	) => PromiseRequest<
		GenericHookParams,
		AllClientResponse<GenericHookParams>
	>
	: <
		GenericPath extends Extract<GenericServerRoute, { method: GenericMethod }>["path"],
		GenericMatchedPath extends GetServerRoutePath<
			Extract<GenericServerRoute, { method: GenericMethod }>,
			GenericPath
		>,
	>(
		path: GenericPath,
		...args: MaybeRequestParams<
			SimplifyTopLevel<
				Omit<
					ServerRouteToClientRequestParams<
						Extract<
							GenericServerRoute,
							{
								method: GenericMethod;
								path: GenericMatchedPath | GenericPath;
							}
						>,
						GenericHookParams
					>,
					"method" | "path"
				>
			>
		>
	) => PromiseRequest<
		GenericHookParams,
		ServerRouteToClientResponse<
			Extract<
				GenericServerRoute,
				{
					method: GenericMethod;
					path: GenericMatchedPath;
				}
			>,
			GenericHookParams
		>
	>;

export interface HttpClientConfig {
	readonly baseUrl: string;
	readonly informationHeaderKey: string;
	readonly predictedHeaderKey: string;
	readonly disabledPredictedMode: boolean;
	readonly credentials?: ClientRequestInitParams["credentials"];
	readonly cache?: ClientRequestInitParams["cache"];
	readonly clientCacheInitialValues?: ClientCacheInitialValues;
}
export interface HttpClient<
	GenericServerRoute extends ServerRoute = ServerRoute,
	GenericHookParams extends Record<string, unknown> = Record<string, unknown>,
> extends Kind<typeof httpClientKind.definition> {
	readonly config: HttpClientConfig;
	readonly hooks: Hooks;
	readonly defaultHeaders: Map<string, () => (string | undefined | null)>;
	readonly cacheStore: ClientCacheStore;

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

	addRequestHook(hook: RequestHook<GenericHookParams>): void;
	addResponseHook(hook: ResponseHook<GenericHookParams>): void;
	addInformationHook(information: string, hook: InformationHook<GenericHookParams>): void;
	addCodeHook(code: string, hook: CodeHook<GenericHookParams>): void;
	addInformationalResponseTypeHook(hook: ResponseTypeHook<GenericHookParams>): void;
	addSuccessfulResponseTypeHook(hook: ResponseTypeHook<GenericHookParams>): void;
	addRedirectionResponseTypeHook(hook: ResponseTypeHook<GenericHookParams>): void;
	addClientErrorResponseTypeHook(hook: ResponseTypeHook<GenericHookParams>): void;
	addServerErrorResponseTypeHook(hook: ResponseTypeHook<GenericHookParams>): void;
	addExpectedResponseHook(hook: ExpectedResponseHook<GenericHookParams>): void;
	addNotPredictedResponseHook(hook: NotPredictedResponseHook<GenericHookParams>): void;
	addErrorHook(hook: ErrorHook<GenericHookParams>): void;
	addBeforeRetryServerEventHook(hook: BeforeRetryServerEventHook<GenericHookParams>): void;
	addCloseServerEventHook(hook: CloseServerEventHook<GenericHookParams>): void;
	addErrorServerEventHook(hook: ErrorServerEventHook<GenericHookParams>): void;
	addStartServerEventHook(hook: StartServerEventHook<GenericHookParams>): void;
	addReceiveEventServerEventHook(hook: ReceiveEventServerEventHook<GenericHookParams>): void;

	request<
		GenericClientRequestParams extends ServerRouteToClientRequestParams<
			GenericServerRoute,
			GenericHookParams
		>,
		GenericMatchedPath extends GetServerRoutePath<
			Extract<GenericServerRoute, { method: GenericClientRequestParams["method"] }>,
			GenericClientRequestParams["path"]
		>,
	>(
		params: GenericClientRequestParams
	): PromiseRequest<
		GenericHookParams,
		IsEqual<GenericServerRoute, ServerRoute> extends true
			? AllClientResponse<GenericHookParams>
			: ServerRouteToClientResponse<
				Extract<
					GenericServerRoute,
					{
						method: GenericClientRequestParams["method"];
						path: GenericMatchedPath;
					}
				>,
				GenericHookParams
			>
	>;

	get: HttpClientRequestMethod<
		GenericServerRoute,
		GenericHookParams,
		"GET"
	>;

	post: HttpClientRequestMethod<
		GenericServerRoute,
		GenericHookParams,
		"POST"
	>;

	put: HttpClientRequestMethod<
		GenericServerRoute,
		GenericHookParams,
		"PUT"
	>;

	patch: HttpClientRequestMethod<
		GenericServerRoute,
		GenericHookParams,
		"PATCH"
	>;

	delete: HttpClientRequestMethod<
		GenericServerRoute,
		GenericHookParams,
		"DELETE"
	>;
}

export interface CreateHttpClientParams {
	readonly baseUrl: string;
	readonly hooks?: Partial<Hooks>;
	readonly credentials?: ClientRequestInitParams["credentials"];
	readonly cache?: ClientRequestInitParams["cache"];
	readonly informationHeaderKey?: string;
	readonly predictedHeaderKey?: string;
	readonly disabledPredictedMode?: boolean;
	readonly clientCacheInitialValues?: ClientCacheInitialValues;
}

export function createHttpClient<
	GenericServerRoute extends ServerRoute = ServerRoute,
	GenericHookParams extends Record<string, unknown> = Record<string, unknown>,
>(
	clientParams: CreateHttpClientParams,
): HttpClient<
		GenericServerRoute,
		GenericHookParams
	> {
	const cacheStore: ClientCacheStore = new Map(
		clientParams.clientCacheInitialValues
			? OO.entries(clientParams.clientCacheInitialValues)
			: [],
	);
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
			notPredictedResponse: [],
			beforeRetryServerEvent: [],
			closeServerEvent: [],
			errorServerEvent: [],
			receiveEventServerEvent: [],
			startServerEvent: [],
		},
		clientParams.hooks ?? {},
	);

	const config: HttpClientConfig = {
		baseUrl: clientParams.baseUrl,
		disabledPredictedMode: clientParams.disabledPredictedMode ?? false,
		informationHeaderKey: clientParams.informationHeaderKey ?? "information",
		predictedHeaderKey: clientParams.predictedHeaderKey ?? "predicted",
		cache: clientParams.cache,
		credentials: clientParams.credentials,
	};

	const defaultHeaders: HttpClient["defaultHeaders"] = new Map();

	const self: HttpClient = httpClientKind.setTo(
		{
			config,
			hooks,
			defaultHeaders,
			cacheStore,
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
					self.addDefaultHeader(header, headerValue);
				}
			},
			addRequestHook(hook) {
				hooks.request.push(hook);
			},
			addResponseHook(hook) {
				hooks.response.push(hook);
			},
			addInformationHook(information, hook) {
				hooks.information[information] ??= [];
				hooks.information[information].push(hook);
			},
			addCodeHook(code, hook) {
				hooks.code[code] ??= [];
				hooks.code[code].push(hook);
			},
			addInformationalResponseTypeHook(hook) {
				hooks.informationalResponseType.push(hook);
			},
			addSuccessfulResponseTypeHook(hook) {
				hooks.successfulResponseType.push(hook);
			},
			addRedirectionResponseTypeHook(hook) {
				hooks.redirectionResponseType.push(hook);
			},
			addClientErrorResponseTypeHook(hook) {
				hooks.clientErrorResponseType.push(hook);
			},
			addServerErrorResponseTypeHook(hook) {
				hooks.serverErrorResponseType.push(hook);
			},
			addExpectedResponseHook(hook) {
				hooks.expectedResponse.push(hook);
			},
			addNotPredictedResponseHook(hook) {
				hooks.notPredictedResponse.push(hook);
			},
			addErrorHook(hook) {
				hooks.error.push(hook);
			},
			addBeforeRetryServerEventHook(hook) {
				hooks.beforeRetryServerEvent.push(hook);
			},
			addCloseServerEventHook(hook) {
				hooks.closeServerEvent.push(hook);
			},
			addErrorServerEventHook(hook) {
				hooks.errorServerEvent.push(hook);
			},
			addReceiveEventServerEventHook(hook) {
				hooks.receiveEventServerEvent.push(hook);
			},
			addStartServerEventHook(hook) {
				hooks.startServerEvent.push(hook);
			},
			request(params) {
				const headers = GG.reduce(
					defaultHeaders.entries(),
					GG.reduceFrom<ClientRequestParamsHeaders>({}),
					({ element, lastValue, next }) => {
						const value = element[1]();
						if (value !== undefined) {
							lastValue[element[0]] = `${value}`;
						}

						return next(lastValue);
					},
				);

				return new PromiseRequest({
					hooks,
					baseUrl: config.baseUrl,
					...params,
					headers: {
						...headers,
						...params.headers,
					},
					initParams: {
						...params.initParams,
						credentials: params.initParams?.credentials ?? clientParams.credentials,
						cache: params.initParams?.cache ?? clientParams.cache,
					},
					predictedHeaderKey: config.predictedHeaderKey,
					informationHeaderKey: config.informationHeaderKey,
					disabledPredicateMode: config.disabledPredictedMode,
					abortController: params.abortController ?? new AbortController(),
					cacheStore: cacheStore,
					clientCache: params.clientCache === "auto"
						? autoCreateCacheKey
						: params.clientCache,
				});
			},
			get: ((path: string, params?: object) => self.request({
				method: "GET",
				path,
				...params,
			})) as never,
			post: ((path: string, params?: object) => self.request({
				method: "POST",
				path,
				...params,
			})) as never,
			put: ((path: string, params?: object) => self.request({
				method: "PUT",
				path,
				...params,
			})) as never,
			patch: ((path: string, params?: object) => self.request({
				method: "PATCH",
				path,
				...params,
			})) as never,
			delete: ((path: string, params?: object) => self.request({
				method: "DELETE",
				path,
				...params,
			})) as never,
		} satisfies RemoveKind<HttpClient>,
	);

	return self as never;
}
