import { type NeverCoalescing, type MaybePromise, unwrap, TheFormData, type O, type IsEqual } from "@duplojs/utils";
import { getBody } from "./getBody";
import { insertParamsInPath } from "./insertParamsInPath";
import { queryToString } from "./queryToString";
import { launchRequestHook, launchResponseHook, launchInformationHook, launchCodeHook, launchResponseTypeHook, launchExpectedResponseHook, launchErrorHook, launchNotPredictedHook } from "./hooks";
import * as EE from "@duplojs/utils/either";
import * as SS from "@duplojs/utils/string";
import * as AA from "@duplojs/utils/array";
import { UnexpectedCodeResponseError, UnexpectedInformationResponseError, UnexpectedResponseError, UnexpectedResponseTypeError, type RequestErrorContent } from "./unexpectedResponseError";
import { type NotPredictedClientResponse, type ClientResponse, type PromiseRequestParams, type Hooks, type NotPredictedResponseHook, type ErrorHook } from "./types";

type MaybeResponse<
	GenericClientResponse extends ClientResponse = ClientResponse,
> = (
	| EE.Right<
		"response",
		GenericClientResponse
	>
	| EE.Left<
		"request-error",
		RequestErrorContent
	>
);

type MaybeWantedResponse<
	GenericWantedClientResponse extends ClientResponse = ClientResponse,
	GenericUnexpectClientResponse extends ClientResponse = ClientResponse,
> = (
		| EE.Right<
			"response",
			GenericWantedClientResponse
		>
		| EE.Left<
			"unexpect-response",
			GenericUnexpectClientResponse
		>
		| EE.Left<
			"request-error",
			RequestErrorContent
		>
	);

export class PromiseRequest<
	GenericHookParams extends Record<string, unknown> = Record<string, unknown>,
	GenericClientResponse extends ClientResponse<GenericHookParams> = ClientResponse<GenericHookParams>,
> extends Promise<
		MaybeResponse<
			| GenericClientResponse
			| NotPredictedClientResponse<GenericHookParams>
		>
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
						if (params.disabledPredicateMode === false && response.predicted === false) {
							await launchNotPredictedHook(
								params.hooks.notPredictedResponse,
								this.hooks.notPredictedResponse ?? [],
								response as never,
							);

							return EE.right("response", response);
						}

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
				.then(
					async(result): Promise<MaybeResponse> => {
						if (EE.eitherFutureErrorKind.has(result)) {
							const error = unwrap(result);

							await launchErrorHook(
								params.hooks.error,
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
						}

						return result;
					},
				)
				.then(resolve as never),
		);
	}

	public addRequestInterceptor(
		callback: (
			requestParams: GenericClientResponse["requestParams"]
		) => MaybePromise<GenericClientResponse["requestParams"]>,
	) {
		this.hooks.request ??= [];
		this.hooks.request.push(callback as never);

		return this;
	}

	public addResponseInterceptor(
		callback: (response: GenericClientResponse) => MaybePromise<GenericClientResponse>,
	) {
		this.hooks.response ??= [];
		this.hooks.response.push(callback as never);

		return this;
	}

	public whenNotPredictedResponse(
		callback: NotPredictedResponseHook<GenericHookParams>,
	) {
		this.hooks.notPredictedResponse ??= [];
		this.hooks.notPredictedResponse.push(callback as never);

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
				ClientResponse<GenericHookParams>
			>,
		) => MaybePromise<void>,
	) {
		const formattedInformation = AA.coalescing(information);

		formattedInformation.forEach(
			(information) => {
				this.hooks.information ??= {};
				this.hooks.information[information] ??= [];
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
				ClientResponse<GenericHookParams>
			>,
		) => MaybePromise<void>,
	) {
		const formattedCode = AA.coalescing(code);

		formattedCode.forEach(
			(code) => {
				this.hooks.code ??= {};
				this.hooks.code[code] ??= [];
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
				ClientResponse<GenericHookParams>
			>,
		) => MaybePromise<void>,
	) {
		this.hooks.informationalResponseType ??= [];
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
				ClientResponse<GenericHookParams>
			>,
		) => MaybePromise<void>,
	) {
		this.hooks.successfulResponseType ??= [];
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
				ClientResponse<GenericHookParams>
			>,
		) => MaybePromise<void>,
	) {
		this.hooks.redirectionResponseType ??= [];
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
				ClientResponse<GenericHookParams>
			>,
		) => MaybePromise<void>,
	) {
		this.hooks.clientErrorResponseType ??= [];
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
				ClientResponse<GenericHookParams>
			>,
		) => MaybePromise<void>,
	) {
		this.hooks.serverErrorResponseType ??= [];
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
				ClientResponse<GenericHookParams>
			>,
		) => MaybePromise<void>,
	) {
		this.hooks.expectedResponse ??= [];
		this.hooks.expectedResponse.push(callback as never);

		return this;
	}

	public whenError(callback: ErrorHook<GenericHookParams>) {
		this.hooks.error ??= [];
		this.hooks.error.push(callback as never);

		return this;
	}

	public iWantInformation<
		GenericInformation extends Extract<
			GenericClientResponse["information"],
			string
		>,
		GenericResponse extends NeverCoalescing<
			Extract<
				GenericClientResponse,
				GenericInformation extends any
					? { information: GenericInformation }
					: never
			>,
			ClientResponse<GenericHookParams>
		>,
	>(
		information: GenericInformation | GenericInformation[],
	): Promise<
			MaybeWantedResponse<
				GenericResponse,
				NeverCoalescing<
					Exclude<GenericClientResponse, GenericResponse>,
					ClientResponse<GenericHookParams>
				>
			>
		> {
		const formattedInformation: readonly string[] = AA.coalescing(information);

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
		GenericResponse extends NeverCoalescing<
			Extract<
				GenericClientResponse,
				GenericCode extends any
					? { code: GenericCode }
					: never
			>,
			ClientResponse<GenericHookParams>
		>,
	>(
		code: GenericCode | GenericCode[],
	): Promise<
			MaybeWantedResponse<
				GenericResponse,
				NeverCoalescing<
					Exclude<GenericClientResponse, GenericResponse>,
					ClientResponse<GenericHookParams>
				>
			>
		> {
		const formattedCode: readonly SS.Number[] = AA.coalescing(code);

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

	public iWantInformationalResponse<
		GenericResponse extends NeverCoalescing<
			Extract<
				GenericClientResponse,
				{ code: `1${number}` }
			>,
			ClientResponse<GenericHookParams>
		>,
	>(): Promise<
		MaybeWantedResponse<
			GenericResponse,
			NeverCoalescing<
				Exclude<GenericClientResponse, GenericResponse>,
				ClientResponse<GenericHookParams>
			>
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

	public iWantSuccessfulResponse<
		GenericResponse extends NeverCoalescing<
			Extract<
				GenericClientResponse,
				{ code: `2${number}` }
			>,
			ClientResponse<GenericHookParams>
		>,
	>(): Promise<
		MaybeWantedResponse<
			GenericResponse,
			NeverCoalescing<
				Exclude<GenericClientResponse, GenericResponse>,
				ClientResponse<GenericHookParams>
			>
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

	public iWantRedirectionResponse<
		GenericResponse extends NeverCoalescing<
			Extract<
				GenericClientResponse,
				{ code: `3${number}` }
			>,
			ClientResponse<GenericHookParams>
		>,
	>(): Promise<
		MaybeWantedResponse<
			GenericResponse,
			NeverCoalescing<
				Exclude<GenericClientResponse, GenericResponse>,
				ClientResponse<GenericHookParams>
			>
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

	public iWantClientErrorResponse<
		GenericResponse extends NeverCoalescing<
			Extract<
				GenericClientResponse,
				{ code: `4${number}` }
			>,
			ClientResponse<GenericHookParams>
		>,
	>(): Promise<
		MaybeWantedResponse<
			GenericResponse,
			NeverCoalescing<
				Exclude<GenericClientResponse, GenericResponse>,
				ClientResponse<GenericHookParams>
			>
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

	public iWantServerErrorResponse<
		GenericResponse extends NeverCoalescing<
			Extract<
				GenericClientResponse,
				{ code: `5${number}` }
			>,
			ClientResponse<GenericHookParams>
		>,
	>(): Promise<
		MaybeWantedResponse<
			GenericResponse,
			NeverCoalescing<
				Exclude<GenericClientResponse, GenericResponse>,
				ClientResponse<GenericHookParams>
			>
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

	public iWantExpectedResponse<
		GenericResponse extends NeverCoalescing<
			Extract<
				GenericClientResponse,
				{ code: `2${number}` | `4${number}` }
			>,
			ClientResponse<GenericHookParams>
		>,
	>(): Promise<
		MaybeWantedResponse<
			GenericResponse,
			NeverCoalescing<
				Exclude<GenericClientResponse, GenericResponse>,
				ClientResponse<GenericHookParams>
			>
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

	public iSelectExpectedResponseByInformation<
		const GenericSelector extends Record<
			Extract<GenericClientResponse["information"], string>,
			boolean
		>,
		GenericResponse extends Extract<
			GenericClientResponse,
			| { information: O.GetPropsWithValue<GenericSelector, true> }
			| { information: O.GetPropsWithValue<GenericSelector, boolean> }
		>,
		GenericUnexpectedResponse extends Extract<
			GenericClientResponse,
			| { information: O.GetPropsWithValue<GenericSelector, false> }
			| { information: O.GetPropsWithValue<GenericSelector, boolean> }
		>,
	>(
		selector: GenericSelector,
	): Promise<
			MaybeWantedResponse<
				NeverCoalescing<
					GenericResponse,
					ClientResponse<GenericHookParams>
				>,
				NeverCoalescing<
					GenericUnexpectedResponse,
					ClientResponse<GenericHookParams>
				>
			>
		> {
		return this.then(
			EE.whenIsRight(
				(response) => {
					if (selector[(response.information ?? "") as never] === true) {
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
			NeverCoalescing<
				Extract<
					GenericClientResponse,
					GenericInformation extends any
						? { information: GenericInformation }
						: never
				>,
				ClientResponse<GenericHookParams>
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
			NeverCoalescing<
				Extract<
					GenericClientResponse,
					GenericCode extends any
						? { code: GenericCode }
						: never
				>,
				ClientResponse<GenericHookParams>
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
		NeverCoalescing<
			Extract<
				GenericClientResponse,
				{ code: `1${number}` }
			>,
			ClientResponse<GenericHookParams>
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
		NeverCoalescing<
			Extract<
				GenericClientResponse,
				{ code: `2${number}` }
			>,
			ClientResponse<GenericHookParams>
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
		NeverCoalescing<
			Extract<
				GenericClientResponse,
				{ code: `3${number}` }
			>,
			ClientResponse<GenericHookParams>
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
		NeverCoalescing<
			Extract<
				GenericClientResponse,
				{ code: `4${number}` }
			>,
			ClientResponse<GenericHookParams>
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
		NeverCoalescing<
			Extract<
				GenericClientResponse,
				{ code: `5${number}` }
			>,
			ClientResponse<GenericHookParams>
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
		NeverCoalescing<
			Extract<
				GenericClientResponse,
				{ code: `2${number}` | `4${number}` }
			>,
			ClientResponse<GenericHookParams>
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

	public iSelectExpectedResponseByInformationOrThrow<
		const GenericSelector extends Record<
			Extract<GenericClientResponse["information"], string>,
			boolean
		>,
		GenericResponse extends Extract<
			GenericClientResponse,
			| { information: O.GetPropsWithValue<GenericSelector, true> }
			| { information: O.GetPropsWithValue<GenericSelector, boolean> }
		>,
	>(
		selector: GenericSelector,
	): Promise<
			NeverCoalescing<
				GenericResponse,
				ClientResponse<GenericHookParams>
			>
		> {
		return this
			.iSelectExpectedResponseByInformation(selector)
			.then(
				(maybeResponse) => {
					if (EE.isRight(maybeResponse)) {
						return unwrap(maybeResponse);
					}

					throw new UnexpectedResponseError(
						unwrap(maybeResponse),
					);
				},
			) as never;
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
				} else if (body instanceof TheFormData) {
					headers["content-type-options"] = "advanced";
				} else if (
					(
						body
						&& typeof body === "object"
						&& (body as object)?.constructor?.name === "Object"
					)
					|| (
						body instanceof Array
						&& body?.constructor?.name === "Array"
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
				headers: <never>headers,
				method: requestParams.method,
				body: <never>body,
			},
		)
			.then(
				(response) => getBody(response)
					.then(
						(body) => EE.right(
							"response",
							{
								body,
								information: response.headers.get(requestParams.informationHeaderKey) || undefined,
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
								predicted: response.headers.get(requestParams.predictedHeaderKey) !== null,
							} satisfies ClientResponse,
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
