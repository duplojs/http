import { type RemoveKind, type Kind, type MayBeGetter, type NeverCoalescing, type SimplifyTopLevel } from "@duplojs/utils";
import * as OO from "@duplojs/utils/object";
import * as GG from "@duplojs/utils/generator";
import { createClientKind } from "./kind";
import { type ClientRequestInitParams, type ServerRoute, type ServerRouteToClientRequestParams, type ServerRouteToClientResponse, type ClientRequestParamsHeaders, type ClientRequestParams } from "./types";
import { PromiseRequest, type PromiseRequestParams } from "./promiseRequest";
import { type Hooks, type RequestHook, type ResponseHook, type InformationHook, type CodeHook, type ResponseTypeHook, type ExpectedResponseHook, type ErrorHook, type NotPredictedResponseHook } from "./hooks";

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
> = <
	GenericClientRequestParams extends NeverCoalescing<
		ServerRouteToClientRequestParams<
			Extract<GenericServerRoute, { method: GenericMethod }>,
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
) => PromiseRequest<
	PromiseRequestParams<GenericHookParams>,
	ServerRouteToClientResponse<
		NeverCoalescing<
			Extract<
				GenericServerRoute,
				{
					method: GenericMethod;
					path: GenericPath;
				}
			>,
			ServerRoute
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
}
export interface HttpClient<
	GenericServerRoute extends ServerRoute = ServerRoute,
	GenericHookParams extends Record<string, unknown> = Record<string, unknown>,
> extends Kind<typeof httpClientKind.definition> {
	readonly config: HttpClientConfig;
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

	addRequestHook(hook: RequestHook<PromiseRequestParams<GenericHookParams>>): void;
	addResponseHook(hook: ResponseHook<PromiseRequestParams<GenericHookParams>>): void;
	addInformationHook(information: string, hook: InformationHook<PromiseRequestParams<GenericHookParams>>): void;
	addCodeHook(code: string, hook: CodeHook<PromiseRequestParams<GenericHookParams>>): void;
	addInformationalResponseTypeHook(hook: ResponseTypeHook<PromiseRequestParams<GenericHookParams>>): void;
	addSuccessfulResponseTypeHook(hook: ResponseTypeHook<PromiseRequestParams<GenericHookParams>>): void;
	addRedirectionResponseTypeHook(hook: ResponseTypeHook<PromiseRequestParams<GenericHookParams>>): void;
	addClientErrorResponseTypeHook(hook: ResponseTypeHook<PromiseRequestParams<GenericHookParams>>): void;
	addServerErrorResponseTypeHook(hook: ResponseTypeHook<PromiseRequestParams<GenericHookParams>>): void;
	addExpectedResponseHook(hook: ExpectedResponseHook<PromiseRequestParams<GenericHookParams>>): void;
	addNotPredictedResponseHook(hook: NotPredictedResponseHook<PromiseRequestParams<GenericHookParams>>): void;
	addErrorHook(hook: ErrorHook<PromiseRequestParams<GenericHookParams>>): void;

	request<
		GenericClientRequestParams extends ServerRouteToClientRequestParams<
			GenericServerRoute,
			GenericHookParams
		>,
	>(
		params: GenericClientRequestParams
	): PromiseRequest<
		PromiseRequestParams<GenericHookParams>,
		ServerRouteToClientResponse<
			Extract<
				GenericServerRoute,
				{
					method: GenericClientRequestParams["method"];
					path: GenericClientRequestParams["path"];
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
}

export function createHttpClient<
	GenericServerRoute extends ServerRoute = never,
	GenericHookParams extends Record<string, unknown> = Record<string, unknown>,
>(
	clientParams: CreateHttpClientParams,
): HttpClient<
		NeverCoalescing<GenericServerRoute, ServerRoute>,
		GenericHookParams
	> {
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
					baseUrl: config.baseUrl,
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
					predictedHeaderKey: config.predictedHeaderKey,
					informationHeaderKey: config.informationHeaderKey,
					disabledPredicateMode: config.disabledPredictedMode,
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
			delete: ((path: string, params?: object) => self.request({
				method: "DELETE",
				path,
				...params,
			})) as never,
		} satisfies RemoveKind<HttpClient>,
	);

	return self as never;
}
