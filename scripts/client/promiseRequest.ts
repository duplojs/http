import { type NeverCoalescing, type MaybePromise, unwrap } from "@duplojs/utils";
import { getBody } from "./getBody";
import { insertParamsInPath } from "./insertParamsInPath";
import { queryToString } from "./queryToString";
import { type Hooks, launchRequestHook, launchResponseHook, launchInformationHook, launchCodeHook, launchResponseTypeHook, launchExpectedResponseHook, launchErrorHook, type ErrorHook } from "./hooks";
import * as EE from "@duplojs/utils/either";
import * as SS from "@duplojs/utils/string";
import * as AA from "@duplojs/utils/array";
import { UnexpectedCodeResponseError, UnexpectedInformationResponseError, UnexpectedResponseError, UnexpectedResponseTypeError, type ErrorContent } from "./unexpectedResponseError";
import { type ClientRequestParams, type ClientResponse } from "./types";

type MaybeResponse<
	GenericClientResponse extends ClientResponse = ClientResponse,
> = (
	| EE.EitherRight<
		"response",
		GenericClientResponse
	>
	| EE.EitherLeft<
		"request-error",
		ErrorContent
	>
);

type MaybeWantedResponse<
	GenericWantedClientResponse extends ClientResponse = ClientResponse,
	GenericClientResponse extends ClientResponse = ClientResponse,
> = (
	| EE.EitherRight<
		"response",
		GenericWantedClientResponse
	>
	| EE.EitherLeft<
		"unexpect-response",
		Exclude<
			GenericClientResponse,
			GenericWantedClientResponse
		>
	>
	| EE.EitherLeft<
		"request-error",
		ErrorContent
	>
);

export interface PromiseRequestParams extends ClientRequestParams {
	baseUrl: string;
	hooks: Hooks;
}

export class PromiseRequest<
	GenericPromiseRequestParams extends PromiseRequestParams = PromiseRequestParams,
	GenericClientResponse extends ClientResponse = ClientResponse,
> extends Promise<
		MaybeResponse<GenericClientResponse>
	> {
	public readonly hooks: Partial<Hooks> = {};

	public constructor(
		public params: PromiseRequestParams,
	) {
		super(
			(resolve) => void EE
				.rightAsyncPipe(
					Promise.resolve(params),
					(params) => launchRequestHook(
						params.hooks.request,
						this.hooks.request ?? [],
						params,
					),
					PromiseRequest.fetch,
					(response) => launchResponseHook(
						params.hooks.response,
						this.hooks.response ?? [],
						response,
					),
					async(response) => {
						if (SS.startsWith(response.code, "1")) {
							await launchResponseTypeHook(
								params.hooks.informationalResponseType,
								this.hooks.informationalResponseType ?? [],
								response,
							);
						} else if (SS.startsWith(response.code, "2")) {
							await launchResponseTypeHook(
								params.hooks.successfulResponseType,
								this.hooks.successfulResponseType ?? [],
								response,
							);

							await launchExpectedResponseHook(
								params.hooks.expectedResponse,
								this.hooks.expectedResponse ?? [],
								response,
							);
						} else if (SS.startsWith(response.code, "3")) {
							await launchResponseTypeHook(
								params.hooks.redirectionResponseType,
								this.hooks.redirectionResponseType ?? [],
								response,
							);
						} else if (SS.startsWith(response.code, "4")) {
							await launchResponseTypeHook(
								params.hooks.clientErrorResponseType,
								this.hooks.clientErrorResponseType ?? [],
								response,
							);

							await launchExpectedResponseHook(
								params.hooks.expectedResponse,
								this.hooks.expectedResponse ?? [],
								response,
							);
						} else if (SS.startsWith(response.code, "5")) {
							await launchResponseTypeHook(
								params.hooks.serverErrorResponseType,
								this.hooks.serverErrorResponseType ?? [],
								response,
							);
						}

						if (response.information !== undefined) {
							await launchInformationHook(
								params.hooks.information[response.information] ?? [],
								this.hooks.information?.[response.information] ?? [],
								response,
							);
						}

						await launchCodeHook(
							params.hooks.code[response.code] ?? [],
							this.hooks.code?.[response.code] ?? [],
							response,
						);

						return EE.right("response", response);
					},
				)
				.catch(
					async(error) => {
						await launchErrorHook(
							params.hooks.error ?? [],
							this.hooks.error ?? [],
							error,
							params,
						);

						return EE.left(
							"request-error",
							{
								error,
								requestParams: params,
							},
						);
					},
				)
				.then(resolve as never),
		);
	}

	public addRequestInterceptor(
		callback: (requestParams: GenericPromiseRequestParams) => MaybePromise<GenericPromiseRequestParams>,
	) {
		this.hooks.request ||= [];
		this.hooks.request.push(callback as never);

		return this;
	}

	public addResponseInterceptor(
		callback: (response: GenericClientResponse) => MaybePromise<GenericClientResponse>,
	) {
		this.hooks.response ||= [];
		this.hooks.response.push(callback as never);

		return this;
	}

	public whenInformation<
		GenericInformation extends Extract<
			GenericClientResponse["information"],
			string
		>,
	>(
		information: GenericInformation | GenericInformation[],
		callback: (
			response: NeverCoalescing<
				Extract<
					GenericClientResponse,
					GenericInformation extends any
						? { information: GenericInformation }
						: never
				>,
				ClientResponse
			>,
		) => MaybePromise<void>,
	) {
		const formattedInformation = AA.coalescing(information);

		formattedInformation.forEach(
			(information) => {
				this.hooks.information ||= {};
				this.hooks.information[information] ||= [];
				this.hooks.information[information].push(callback as never);
			},
		);

		return this;
	}

	public whenCode<
		GenericCode extends GenericClientResponse["code"],
	>(
		code: GenericCode | GenericCode[],
		callback: (
			response: NeverCoalescing<
				Extract<
					GenericClientResponse,
					GenericCode extends any
						? { code: GenericCode }
						: never
				>,
				ClientResponse
			>,
		) => MaybePromise<void>,
	) {
		const formattedCode = AA.coalescing(code);

		formattedCode.forEach(
			(code) => {
				this.hooks.code ||= {};
				this.hooks.code[code] ||= [];
				this.hooks.code[code].push(callback as never);
			},
		);

		return this;
	}

	public whenInformationalResponse(
		callback: (
			response: NeverCoalescing<
				Extract<
					GenericClientResponse,
					{ code: `1${number}` }
				>,
				ClientResponse
			>,
		) => MaybePromise<void>,
	) {
		this.hooks.informationalResponseType ||= [];
		this.hooks.informationalResponseType.push(callback as never);

		return this;
	}

	public whenSuccessfulResponse(
		callback: (
			response: NeverCoalescing<
				Extract<
					GenericClientResponse,
					{ code: `2${number}` }
				>,
				ClientResponse
			>,
		) => MaybePromise<void>,
	) {
		this.hooks.successfulResponseType ||= [];
		this.hooks.successfulResponseType.push(callback as never);

		return this;
	}

	public whenRedirectionResponse(
		callback: (
			response: NeverCoalescing<
				Extract<
					GenericClientResponse,
					{ code: `3${number}` }
				>,
				ClientResponse
			>,
		) => MaybePromise<void>,
	) {
		this.hooks.redirectionResponseType ||= [];
		this.hooks.redirectionResponseType.push(callback as never);

		return this;
	}

	public whenClientErrorResponse(
		callback: (
			response: NeverCoalescing<
				Extract<
					GenericClientResponse,
					{ code: `4${number}` }
				>,
				ClientResponse
			>,
		) => MaybePromise<void>,
	) {
		this.hooks.clientErrorResponseType ||= [];
		this.hooks.clientErrorResponseType.push(callback as never);

		return this;
	}

	public whenServerErrorResponse(
		callback: (
			response: NeverCoalescing<
				Extract<
					GenericClientResponse,
					{ code: `5${number}` }
				>,
				ClientResponse
			>,
		) => MaybePromise<void>,
	) {
		this.hooks.serverErrorResponseType ||= [];
		this.hooks.serverErrorResponseType.push(callback as never);

		return this;
	}

	public whenExpectedResponse(
		callback: (
			response: NeverCoalescing<
				Extract<
					GenericClientResponse,
					{ code: `2${number}` | `4${number}` }
				>,
				ClientResponse
			>,
		) => MaybePromise<void>,
	) {
		this.hooks.expectedResponse ||= [];
		this.hooks.expectedResponse.push(callback as never);

		return this;
	}

	public whenError(callback: ErrorHook) {
		this.hooks.error ||= [];
		this.hooks.error.push(callback as never);

		return this;
	}

	public iWantInformation<
		GenericInformation extends Extract<
			GenericClientResponse["information"],
			string
		>,
	>(
		information: GenericInformation | GenericInformation[],
	): Promise<
			MaybeWantedResponse<
				Extract<
					GenericClientResponse,
					GenericInformation extends any
						? { information: GenericInformation }
						: never
				>,
				GenericClientResponse
			>
		> {
		const formattedInformation = AA.coalescing(information);

		return this.then(
			EE.whenIsRight(
				(response) => {
					if (
						response.information !== undefined
						&& AA.includes(formattedInformation, response.information)
					) {
						return EE.right(
							"response",
							response,
						);
					}

					return EE.left(
						"unexpect-response",
						response,
					);
				},
			),
		) as never;
	}

	public iWantCode<
		GenericCode extends GenericClientResponse["code"],
	>(
		code: GenericCode | GenericCode[],
	): Promise<
			MaybeWantedResponse<
				Extract<
					GenericClientResponse,
					GenericCode extends any
						? { code: GenericCode }
						: never
				>,
				GenericClientResponse
			>
		> {
		const formattedCode = AA.coalescing(code);

		return this.then(
			EE.whenIsRight(
				(response) => {
					if (AA.includes(formattedCode, response.code)) {
						return EE.right(
							"response",
							response,
						);
					}

					return EE.left(
						"unexpect-response",
						response,
					);
				},
			),
		) as never;
	}

	public iWantInformationalResponse(): Promise<
		MaybeWantedResponse<
			Extract<
				GenericClientResponse,
				{ code: `1${number}` }
			>,
			GenericClientResponse
		>
	> {
		return this.then(
			EE.whenIsRight(
				(response) => {
					if (SS.startsWith(response.code, "1")) {
						return EE.right(
							"response",
							response,
						);
					}

					return EE.left(
						"unexpect-response",
						response,
					);
				},
			),
		) as never;
	}

	public iWantSuccessfulResponse(): Promise<
		MaybeWantedResponse<
			Extract<
				GenericClientResponse,
				{ code: `2${number}` }
			>,
			GenericClientResponse
		>
	> {
		return this.then(
			EE.whenIsRight(
				(response) => {
					if (SS.startsWith(response.code, "2")) {
						return EE.right(
							"response",
							response,
						);
					}

					return EE.left(
						"unexpect-response",
						response,
					);
				},
			),
		) as never;
	}

	public iWantRedirectionResponse(): Promise<
		MaybeWantedResponse<
			Extract<
				GenericClientResponse,
				{ code: `3${number}` }
			>,
			GenericClientResponse
		>
	> {
		return this.then(
			EE.whenIsRight(
				(response) => {
					if (SS.startsWith(response.code, "3")) {
						return EE.right(
							"response",
							response,
						);
					}

					return EE.left(
						"unexpect-response",
						response,
					);
				},
			),
		) as never;
	}

	public iWantClientErrorResponse(): Promise<
		MaybeWantedResponse<
			Extract<
				GenericClientResponse,
				{ code: `4${number}` }
			>,
			GenericClientResponse
		>
	> {
		return this.then(
			EE.whenIsRight(
				(response) => {
					if (SS.startsWith(response.code, "4")) {
						return EE.right(
							"response",
							response,
						);
					}

					return EE.left(
						"unexpect-response",
						response,
					);
				},
			),
		) as never;
	}

	public iWantServerErrorResponse(): Promise<
		MaybeWantedResponse<
			Extract<
				GenericClientResponse,
				{ code: `5${number}` }
			>,
			GenericClientResponse
		>
	> {
		return this.then(
			EE.whenIsRight(
				(response) => {
					if (SS.startsWith(response.code, "5")) {
						return EE.right(
							"response",
							response,
						);
					}

					return EE.left(
						"unexpect-response",
						response,
					);
				},
			),
		) as never;
	}

	public iWantExpectedResponse(): Promise<
		MaybeWantedResponse<
			Extract<
				GenericClientResponse,
				{ code: `2${number}` | `4${number}` }
			>,
			GenericClientResponse
		>
	> {
		return this.then(
			EE.whenIsRight(
				(response) => {
					if (SS.startsWith(response.code, "2") || SS.startsWith(response.code, "4")) {
						return EE.right(
							"response",
							response,
						);
					}

					return EE.left(
						"unexpect-response",
						response,
					);
				},
			),
		) as never;
	}

	public iWantInformationOrThrow<
		GenericInformation extends Extract<
			GenericClientResponse["information"],
			string
		>,
	>(
		information: GenericInformation | GenericInformation[],
	): Promise<
			Extract<
				GenericClientResponse,
				GenericInformation extends any
					? { information: GenericInformation }
					: never
			>
		> {
		return this
			.iWantInformation(information)
			.then(
				(maybeResponse) => {
					if (EE.isRight(maybeResponse)) {
						return unwrap(maybeResponse);
					}

					throw new UnexpectedInformationResponseError(
						information,
						unwrap(maybeResponse),
					);
				},
			);
	}

	public iWantCodeOrThrow<
		GenericCode extends GenericClientResponse["code"],
	>(
		code: GenericCode | GenericCode[],
	): Promise<
			Extract<
				GenericClientResponse,
				GenericCode extends any
					? { code: GenericCode }
					: never
			>
		> {
		return this
			.iWantCode(code)
			.then(
				(maybeResponse) => {
					if (EE.isRight(maybeResponse)) {
						return unwrap(maybeResponse);
					}

					throw new UnexpectedCodeResponseError(
						code,
						unwrap(maybeResponse),
					);
				},
			);
	}

	public iWantInformationalResponseOrThrow(): Promise<
		Extract<
			GenericClientResponse,
			{ code: `1${number}` }
		>
	> {
		return this
			.iWantInformationalResponse()
			.then(
				(maybeResponse) => {
					if (EE.isRight(maybeResponse)) {
						return unwrap(maybeResponse);
					}

					throw new UnexpectedResponseTypeError(
						"informational",
						unwrap(maybeResponse),
					);
				},
			);
	}

	public iWantSuccessfulResponseOrThrow(): Promise<
		Extract<
			GenericClientResponse,
			{ code: `2${number}` }
		>
	> {
		return this
			.iWantSuccessfulResponse()
			.then(
				(maybeResponse) => {
					if (EE.isRight(maybeResponse)) {
						return unwrap(maybeResponse);
					}

					throw new UnexpectedResponseTypeError(
						"successful",
						unwrap(maybeResponse),
					);
				},
			);
	}

	public iWantRedirectionResponseOrThrow(): Promise<
		Extract<
			GenericClientResponse,
			{ code: `3${number}` }
		>
	> {
		return this
			.iWantRedirectionResponse()
			.then(
				(maybeResponse) => {
					if (EE.isRight(maybeResponse)) {
						return unwrap(maybeResponse);
					}

					throw new UnexpectedResponseTypeError(
						"redirection",
						unwrap(maybeResponse),
					);
				},
			);
	}

	public iWantClientErrorResponseOrThrow(): Promise<
		Extract<
			GenericClientResponse,
			{ code: `4${number}` }
		>
	> {
		return this
			.iWantClientErrorResponse()
			.then(
				(maybeResponse) => {
					if (EE.isRight(maybeResponse)) {
						return unwrap(maybeResponse);
					}

					throw new UnexpectedResponseTypeError(
						"clientError",
						unwrap(maybeResponse),
					);
				},
			);
	}

	public iWantServerErrorResponseOrThrow(): Promise<
		Extract<
			GenericClientResponse,
			{ code: `5${number}` }
		>
	> {
		return this
			.iWantServerErrorResponse()
			.then(
				(maybeResponse) => {
					if (EE.isRight(maybeResponse)) {
						return unwrap(maybeResponse);
					}

					throw new UnexpectedResponseTypeError(
						"informational",
						unwrap(maybeResponse),
					);
				},
			);
	}

	public iWantExpectedResponseOrThrow(): Promise<
		Extract<
			GenericClientResponse,
			{ code: `2${number}` | `4${number}` }
		>
	> {
		return this
			.iWantExpectedResponse()
			.then(
				(maybeResponse) => {
					if (EE.isRight(maybeResponse)) {
						return unwrap(maybeResponse);
					}

					throw new UnexpectedResponseError(
						unwrap(maybeResponse),
					);
				},
			);
	}

	public static override get [Symbol.species]() {
		return Promise;
	}

	public static fetch<
		GenericPromiseRequestParams extends PromiseRequestParams,
	>(
		requestParams: GenericPromiseRequestParams,
	): Promise<MaybeResponse> {
		const path = insertParamsInPath(requestParams.path, requestParams.params);
		const query = queryToString(requestParams.query);
		const url = query
			? `${path}?${query}`
			: path;

		const headers = { ...requestParams.headers };
		let body = requestParams.body;

		if (body) {
			if (!headers["content-type"]) {
				if (typeof body === "string") {
					headers["content-type"] = "text/plain; charset=utf-8";
					body = body.toString();
				} else if (
					(
						body
						&& typeof body === "object"
						&& body.constructor.name === "Object"
					)
					|| body === null
					|| typeof body === "boolean"
					|| typeof body === "number"
				) {
					headers["content-type"] = "application/json; charset=utf-8";
					body = JSON.stringify(body);
				}
			}
		}

		return fetch(
			`${requestParams.baseUrl}${url}`,
			{
				...requestParams.initParams,
				headers: <never>requestParams.headers,
				method: requestParams.method,
				body: <never>requestParams.body,
			},
		)
			.then(
				(response) => getBody(response)
					.then(
						(body) => EE.right(
							"response",
							{
								body,
								information: response.headers.get("information") || undefined,
								code: response.status.toString() as SS.Number,
								ok: (response.status < 500)
									? response.ok
									: null,
								headers: response.headers,
								type: response.type,
								url: response.url,
								redirected: response.redirected,
								raw: response,
								requestParams,
							},
						),
					),
			)
			.catch(
				(error) => EE.left(
					"request-error",
					{
						error,
						requestParams,
					},
				),
			) as never;
	}
}
