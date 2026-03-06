import { createHttpClient, type RequestErrorContent, type PromiseRequest, type PromiseRequestParams, type FindServerRoute, type AddPrefixPathServerRoute, type RemovePrefixPathServerRoute, type FindServerRouteResponse, type AllClientResponse, type AllNotPredictedClientResponse, type ClientEventsResponseHandler } from "@client";
import { E, S, type TheFormData, type ExpectType, createFormData } from "@duplojs/utils";

type Routes = {
	method: "GET";
	path: "/users";
	responses: {
		code: "200";
		information: "users.findMany";
		body: {
			id: number;
			name: string;
			age: number;
		}[];
	};
} | {
	method: "GET";
	path: "/users/{userId}";
	params: {
		userId: number;
	};
	responses: {
		code: "422";
		information: "extract-error";
		body?: undefined;
	} | {
		code: "200";
		information: "users.find";
		body: {
			id: number;
			name: string;
			age: number;
		};
	};
} | {
	method: "POST";
	path: "/users";
	body: {
		id: number;
		name: string;
		age: number;
	};
	responses: {
		code: "422";
		information: "extract-error";
		body?: undefined;
	} | {
		code: "200";
		information: "users.create";
		body: {
			id: number;
			name: string;
			age: number;
		};
	};
} | {
	method: "POST";
	path: "/documents";
	body: TheFormData<{
		bool: boolean;
		myFile: File;
	}>;
	responses: {
		code: "422";
		information: "extract-error";
		body?: undefined;
	} | {
		code: "204";
		information: "file.receive";
		body?: undefined;
	};
} | {
	method: "GET";
	path: `/documents/${string}`;
	responses: {
		code: "200";
		information: "file.send";
		body: File;
	};
} | {
	method: "GET";
	path: "/sse";
	responses: {
		code: "200";
		information: "ess";
		events: {
			message: { test: string };
			ping: string;
		};
		body: undefined;
	};
};

const httpClient = createHttpClient<Routes, { params1: string }>({
	baseUrl: "http://test.com",
});

const promiseRequest = httpClient
	.request({
		method: "GET",
		path: "/users/{userId}",
		params: {
			userId: S.to(1),
		},
	});

type Check = ExpectType<
	typeof promiseRequest,
	PromiseRequest<
		{
			params1: string;
		},
		| {
			code: "422";
			information: "extract-error";
			body: undefined;
			ok: boolean | null;
			headers: Headers;
			type: ResponseType;
			url: string;
			redirected: boolean;
			raw: globalThis.Response;
			requestParams: PromiseRequestParams<{
				params1: string;
			}>;
			predicted: boolean;
		}
		| {
			code: "200";
			information: "users.find";
			body: {
				id: number;
				name: string;
				age: number;
			};
			ok: boolean | null;
			headers: Headers;
			type: ResponseType;
			url: string;
			redirected: boolean;
			raw: globalThis.Response;
			requestParams: PromiseRequestParams<{
				params1: string;
			}>;
			predicted: boolean;
		}
	>,
	"strict"
>;

void promiseRequest
	.whenInformation("users.find", (value) => {
		type Check = ExpectType<
			typeof value,
			{
				code: "200";
				information: "users.find";
				body: {
					id: number;
					name: string;
					age: number;
				};
				ok: boolean | null;
				headers: Headers;
				type: ResponseType;
				url: string;
				redirected: boolean;
				raw: globalThis.Response;
				requestParams: PromiseRequestParams<{
					params1: string;
				}>;
				predicted: boolean;
			},
			"strict"
		>;
	})
	.whenCode("200", (value) => {
		type Check = ExpectType<
			typeof value,
			{
				code: "200";
				information: "users.find";
				body: {
					id: number;
					name: string;
					age: number;
				};
				ok: boolean | null;
				headers: Headers;
				type: ResponseType;
				url: string;
				redirected: boolean;
				raw: globalThis.Response;
				requestParams: PromiseRequestParams<{
					params1: string;
				}>;
				predicted: boolean;
			},
			"strict"
		>;
	})
	.whenInformationalResponse((value) => {
		type Check = ExpectType<
			typeof value,
			AllClientResponse<{
				params1: string;
			}>,
			"strict"
		>;
	})
	.whenSuccessfulResponse((value) => {
		type Check = ExpectType<
			typeof value,
			{
				code: "200";
				information: "users.find";
				body: {
					id: number;
					name: string;
					age: number;
				};
				ok: boolean | null;
				headers: Headers;
				type: ResponseType;
				url: string;
				redirected: boolean;
				raw: globalThis.Response;
				requestParams: PromiseRequestParams<{
					params1: string;
				}>;
				predicted: boolean;
			},
			"strict"
		>;
	})
	.whenRedirectionResponse((value) => {
		type Check = ExpectType<
			typeof value,
			AllClientResponse<{
				params1: string;
			}>,
			"strict"
		>;
	})
	.whenClientErrorResponse((value) => {
		type Check = ExpectType<
			typeof value,
			{
				code: "422";
				information: "extract-error";
				body: undefined;
				ok: boolean | null;
				headers: Headers;
				type: ResponseType;
				url: string;
				redirected: boolean;
				raw: globalThis.Response;
				requestParams: PromiseRequestParams<{
					params1: string;
				}>;
				predicted: boolean;
			},
			"strict"
		>;
	})
	.whenServerErrorResponse((value) => {
		type Check = ExpectType<
			typeof value,
			AllClientResponse<{
				params1: string;
			}>,
			"strict"
		>;
	})
	.whenExpectedResponse((value) => {
		type Check = ExpectType<
			typeof value,
			{
				code: "422";
				information: "extract-error";
				body: undefined;
				ok: boolean | null;
				headers: Headers;
				type: ResponseType;
				url: string;
				redirected: boolean;
				raw: globalThis.Response;
				requestParams: PromiseRequestParams<{
					params1: string;
				}>;
				predicted: boolean;
			} | {
				code: "200";
				information: "users.find";
				body: {
					id: number;
					name: string;
					age: number;
				};
				ok: boolean | null;
				headers: Headers;
				type: ResponseType;
				url: string;
				redirected: boolean;
				raw: globalThis.Response;
				requestParams: PromiseRequestParams<{
					params1: string;
				}>;
				predicted: boolean;
			},
			"strict"
		>;
	})
	.whenNotPredictedResponse((value) => {
		type Check = ExpectType<
			typeof value,
			AllNotPredictedClientResponse<{
				params1: string;
			}>,
			"strict"
		>;
	})
	.whenError((value, requestParams) => {
		type Check = ExpectType<
			typeof value,
			unknown,
			"strict"
		>;

		type Check1 = ExpectType<
			typeof requestParams,
			PromiseRequestParams<{
				params1: string;
			}>,
			"strict"
		>;
	});

void promiseRequest
	.iWantInformation("extract-error")
	.then((value) => {
		if (E.isRight(value)) {
			type Check = ExpectType<
				typeof value,
				E.Right<"response", {
					code: "422";
					information: "extract-error";
					body: undefined;
					ok: boolean | null;
					headers: Headers;
					type: ResponseType;
					url: string;
					redirected: boolean;
					raw: Response;
					requestParams: PromiseRequestParams<{ params1: string }>;
					predicted: boolean;
				}>,
				"strict"
			>;
		} else {
			type Check = ExpectType<
				typeof value,
				E.Left<"request-error", RequestErrorContent> | E.Left<"unexpect-response", {
					code: "200";
					information: "users.find";
					body: {
						id: number;
						name: string;
						age: number;
					};
					ok: boolean | null;
					headers: Headers;
					type: ResponseType;
					url: string;
					redirected: boolean;
					raw: globalThis.Response;
					requestParams: PromiseRequestParams<{
						params1: string;
					}>;
					predicted: boolean;
				}
				| AllNotPredictedClientResponse<{
					params1: string;
				}>
				>,
				"strict"
			>;
		}
	});

void promiseRequest
	.iWantCode("422")
	.then((value) => {
		if (E.isRight(value)) {
			type Check = ExpectType<
				typeof value,
				E.Right<"response", {
					code: "422";
					information: "extract-error";
					body: undefined;
					ok: boolean | null;
					headers: Headers;
					type: ResponseType;
					url: string;
					redirected: boolean;
					raw: Response;
					requestParams: PromiseRequestParams<{ params1: string }>;
					predicted: boolean;
				}>,
				"strict"
			>;
		} else {
			type Check = ExpectType<
				typeof value,
				E.Left<"request-error", RequestErrorContent> | E.Left<"unexpect-response", {
					code: "200";
					information: "users.find";
					body: {
						id: number;
						name: string;
						age: number;
					};
					ok: boolean | null;
					headers: Headers;
					type: ResponseType;
					url: string;
					redirected: boolean;
					raw: globalThis.Response;
					requestParams: PromiseRequestParams<{
						params1: string;
					}>;
					predicted: boolean;
				}
				| AllNotPredictedClientResponse<{
					params1: string;
				}>
				>,
				"strict"
			>;
		}
	});

void promiseRequest
	.iWantInformationalResponse()
	.then((value) => {
		if (E.isRight(value)) {
			type Check = ExpectType<
				typeof value,
				E.Right<"response", AllClientResponse<{
					params1: string;
				}>>,
				"strict"
			>;
		} else {
			type Check = ExpectType<
				typeof value,
				E.Left<"request-error", RequestErrorContent> | E.Left<"unexpect-response", AllClientResponse<{
					params1: string;
				}>
				| AllNotPredictedClientResponse<{
					params1: string;
				}>
				>,
				"strict"
			>;
		}
	});

void promiseRequest
	.iWantSuccessfulResponse()
	.then((value) => {
		if (E.isRight(value)) {
			type Check = ExpectType<
				typeof value,
				E.Right<"response", {
					code: "200";
					information: "users.find";
					body: {
						id: number;
						name: string;
						age: number;
					};
					ok: boolean | null;
					headers: Headers;
					type: ResponseType;
					url: string;
					redirected: boolean;
					raw: globalThis.Response;
					requestParams: PromiseRequestParams<{
						params1: string;
					}>;
					predicted: boolean;
				}>,
				"strict"
			>;
		} else {
			type Check = ExpectType<
				typeof value,
				E.Left<"request-error", RequestErrorContent> | E.Left<"unexpect-response", {
					code: "422";
					information: "extract-error";
					body: undefined;
					ok: boolean | null;
					headers: Headers;
					type: ResponseType;
					url: string;
					redirected: boolean;
					raw: Response;
					requestParams: PromiseRequestParams<{ params1: string }>;
					predicted: boolean;
				}
				| AllNotPredictedClientResponse<{
					params1: string;
				}>>,
				"strict"
			>;
		}
	});

void promiseRequest
	.iWantRedirectionResponse()
	.then((value) => {
		if (E.isRight(value)) {
			type Check = ExpectType<
				typeof value,
				E.Right<"response", AllClientResponse<{
					params1: string;
				}>>,
				"strict"
			>;
		} else {
			type Check = ExpectType<
				typeof value,
				E.Left<"request-error", RequestErrorContent> | E.Left<"unexpect-response", AllClientResponse<{
					params1: string;
				}>
				| AllNotPredictedClientResponse<{
					params1: string;
				}>>,
				"strict"
			>;
		}
	});

void promiseRequest
	.iWantClientErrorResponse()
	.then((value) => {
		if (E.isRight(value)) {
			type Check = ExpectType<
				typeof value,
				E.Right<"response", {
					code: "422";
					information: "extract-error";
					body: undefined;
					ok: boolean | null;
					headers: Headers;
					type: ResponseType;
					url: string;
					redirected: boolean;
					raw: Response;
					requestParams: PromiseRequestParams<{ params1: string }>;
					predicted: boolean;
				}>,
				"strict"
			>;
		} else {
			type Check = ExpectType<
				typeof value,
				E.Left<"request-error", RequestErrorContent> | E.Left<"unexpect-response", {
					code: "200";
					information: "users.find";
					body: {
						id: number;
						name: string;
						age: number;
					};
					ok: boolean | null;
					headers: Headers;
					type: ResponseType;
					url: string;
					redirected: boolean;
					raw: globalThis.Response;
					requestParams: PromiseRequestParams<{
						params1: string;
					}>;
					predicted: boolean;
				}
				| AllNotPredictedClientResponse<{
					params1: string;
				}>
				>,
				"strict"
			>;
		}
	});

void promiseRequest
	.iWantServerErrorResponse()
	.then((value) => {
		if (E.isRight(value)) {
			type Check = ExpectType<
				typeof value,
				E.Right<"response", AllClientResponse<{
					params1: string;
				}>>,
				"strict"
			>;
		} else {
			type Check = ExpectType<
				typeof value,
				E.Left<"request-error", RequestErrorContent> | E.Left<"unexpect-response", AllClientResponse<{
					params1: string;
				}>
				| AllNotPredictedClientResponse<{
					params1: string;
				}>
				>,
				"strict"
			>;
		}
	});

void promiseRequest
	.iWantExpectedResponse()
	.then((value) => {
		if (E.isRight(value)) {
			type Check = ExpectType<
				typeof value,
				E.Right<"response", {
					code: "422";
					information: "extract-error";
					body: undefined;
					ok: boolean | null;
					headers: Headers;
					type: ResponseType;
					url: string;
					redirected: boolean;
					raw: globalThis.Response;
					requestParams: PromiseRequestParams<{
						params1: string;
					}>;
					predicted: boolean;
				} | {
					code: "200";
					information: "users.find";
					body: {
						id: number;
						name: string;
						age: number;
					};
					ok: boolean | null;
					headers: Headers;
					type: ResponseType;
					url: string;
					redirected: boolean;
					raw: globalThis.Response;
					requestParams: PromiseRequestParams<{
						params1: string;
					}>;
					predicted: boolean;
				}>,
				"strict"
			>;
		} else {
			type Check = ExpectType<
				typeof value,
				E.Left<"request-error", RequestErrorContent> | E.Left<"unexpect-response", AllClientResponse<{
					params1: string;
				}>
				| AllNotPredictedClientResponse<{
					params1: string;
				}>
				>,
				"strict"
			>;
		}
	});

void promiseRequest
	.iSelectExpectedResponseByInformation({
		"extract-error": false,
		"users.find": true,
	})
	.then((value) => {
		if (E.isRight(value)) {
			type Check = ExpectType<
				typeof value,
				E.Right<"response", {
					code: "200";
					information: "users.find";
					body: {
						id: number;
						name: string;
						age: number;
					};
					ok: boolean | null;
					headers: Headers;
					type: ResponseType;
					url: string;
					redirected: boolean;
					raw: globalThis.Response;
					requestParams: PromiseRequestParams<{
						params1: string;
					}>;
					predicted: boolean;
				}>,
				"strict"
			>;
		} else {
			type Check = ExpectType<
				typeof value,
				E.Left<"request-error", RequestErrorContent> | E.Left<"unexpect-response", {
					code: "422";
					information: "extract-error";
					body: undefined;
					ok: boolean | null;
					headers: Headers;
					type: ResponseType;
					url: string;
					redirected: boolean;
					raw: Response;
					requestParams: PromiseRequestParams<{ params1: string }>;
					predicted: boolean;
				}
				| AllNotPredictedClientResponse<{
					params1: string;
				}>
				>,
				"strict"
			>;
		}
	});

void promiseRequest
	.iWantInformationOrThrow("users.find")
	.then((value) => {
		type Check = ExpectType<
			typeof value,
			{
				code: "200";
				information: "users.find";
				body: {
					id: number;
					name: string;
					age: number;
				};
				ok: boolean | null;
				headers: Headers;
				type: ResponseType;
				url: string;
				redirected: boolean;
				raw: globalThis.Response;
				requestParams: PromiseRequestParams<{
					params1: string;
				}>;
				predicted: boolean;
			},
			"strict"
		>;
	});

void promiseRequest
	.iWantCodeOrThrow("200")
	.then((value) => {
		type Check = ExpectType<
			typeof value,
			{
				code: "200";
				information: "users.find";
				body: {
					id: number;
					name: string;
					age: number;
				};
				ok: boolean | null;
				headers: Headers;
				type: ResponseType;
				url: string;
				redirected: boolean;
				raw: globalThis.Response;
				requestParams: PromiseRequestParams<{
					params1: string;
				}>;
				predicted: boolean;
			},
			"strict"
		>;
	});

void promiseRequest
	.iWantInformationalResponseOrThrow()
	.then((value) => {
		type Check = ExpectType<
			typeof value,
			AllClientResponse<{
				params1: string;
			}>,
			"strict"
		>;
	});

void promiseRequest
	.iWantSuccessfulResponseOrThrow()
	.then((value) => {
		type Check = ExpectType<
			typeof value,
			{
				code: "200";
				information: "users.find";
				body: {
					id: number;
					name: string;
					age: number;
				};
				ok: boolean | null;
				headers: Headers;
				type: ResponseType;
				url: string;
				redirected: boolean;
				raw: globalThis.Response;
				requestParams: PromiseRequestParams<{
					params1: string;
				}>;
				predicted: boolean;
			},
			"strict"
		>;
	});

void promiseRequest
	.iWantRedirectionResponseOrThrow()
	.then((value) => {
		type Check = ExpectType<
			typeof value,
			AllClientResponse<{
				params1: string;
			}>,
			"strict"
		>;
	});

void promiseRequest
	.iWantClientErrorResponseOrThrow()
	.then((value) => {
		type Check = ExpectType<
			typeof value,
			{
				code: "422";
				information: "extract-error";
				body: undefined;
				ok: boolean | null;
				headers: Headers;
				type: ResponseType;
				url: string;
				redirected: boolean;
				raw: globalThis.Response;
				requestParams: PromiseRequestParams<{
					params1: string;
				}>;
				predicted: boolean;
			},
			"strict"
		>;
	});

void promiseRequest
	.iWantServerErrorResponseOrThrow()
	.then((value) => {
		type Check = ExpectType<
			typeof value,
			AllClientResponse<{
				params1: string;
			}>,
			"strict"
		>;
	});

void promiseRequest
	.iWantExpectedResponseOrThrow()
	.then((value) => {
		type Check = ExpectType<
			typeof value,
			{
				code: "422";
				information: "extract-error";
				body: undefined;
				ok: boolean | null;
				headers: Headers;
				type: ResponseType;
				url: string;
				redirected: boolean;
				raw: globalThis.Response;
				requestParams: PromiseRequestParams<{
					params1: string;
				}>;
				predicted: boolean;
			} | {
				code: "200";
				information: "users.find";
				body: {
					id: number;
					name: string;
					age: number;
				};
				ok: boolean | null;
				headers: Headers;
				type: ResponseType;
				url: string;
				redirected: boolean;
				raw: globalThis.Response;
				requestParams: PromiseRequestParams<{
					params1: string;
				}>;
				predicted: boolean;
			},
			"strict"
		>;
	});

void promiseRequest
	.iSelectExpectedResponseByInformationOrThrow({
		"extract-error": true,
		"users.find": false,
	})
	.then((value) => {
		type Check = ExpectType<
			typeof value,
			{
				code: "422";
				information: "extract-error";
				body: undefined;
				ok: boolean | null;
				headers: Headers;
				type: ResponseType;
				url: string;
				redirected: boolean;
				raw: globalThis.Response;
				requestParams: PromiseRequestParams<{
					params1: string;
				}>;
				predicted: boolean;
			},
			"strict"
		>;
	});

void promiseRequest
	.then((value) => {
		if (E.isRight(value)) {
			type Check = ExpectType<
				typeof value,
				E.Right<
					"response",
					| {
						code: "422";
						information: "extract-error";
						body: undefined;
						ok: boolean | null;
						headers: Headers;
						type: ResponseType;
						url: string;
						redirected: boolean;
						raw: Response;
						requestParams: PromiseRequestParams<{ params1: string }>;
						predicted: boolean;
					}
					| {
						code: "200";
						information: "users.find";
						body: {
							id: number;
							name: string;
							age: number;
						};
						ok: boolean | null;
						headers: Headers;
						type: ResponseType;
						url: string;
						redirected: boolean;
						raw: Response;
						requestParams: PromiseRequestParams<{ params1: string }>;
						predicted: boolean;
					}
					| AllNotPredictedClientResponse<{ params1: string }>
				>,
				"strict"
			>;
		} else {
			type Check = ExpectType<
				typeof value,
				E.Left<"request-error", RequestErrorContent>,
				"strict"
			>;
		}
	});

void httpClient.get("/users")
	.whenInformation("users.findMany", (value) => {
		type Check = ExpectType<
			typeof value,
			{
				code: "200";
				information: "users.findMany";
				body: {
					id: number;
					name: string;
					age: number;
				}[];
				ok: boolean | null;
				headers: Headers;
				type: ResponseType;
				url: string;
				redirected: boolean;
				raw: globalThis.Response;
				requestParams: PromiseRequestParams<{
					params1: string;
				}>;
				predicted: boolean;
			},
			"strict"
		>;
	})
	.then((value) => {
		type Check = ExpectType<
			typeof value,
			| E.Left<"request-error", RequestErrorContent>
			| E.Right<
				"response",
				| AllNotPredictedClientResponse<{ params1: string }>
				| {
					code: "200";
					information: "users.findMany";
					body: {
						id: number;
						name: string;
						age: number;
					}[];
					ok: boolean | null;
					headers: Headers;
					type: ResponseType;
					url: string;
					redirected: boolean;
					raw: Response;
					requestParams: PromiseRequestParams<{ params1: string }>;
					predicted: boolean;
				}
			>,
			"strict"
		>;
	});

void httpClient.post("/users", {
	body: {
		id: 1,
		name: "",
		age: 2,
	},
})
	.whenInformation("users.create", (value) => {
		type Check = ExpectType<
			typeof value,
			{
				code: "200";
				information: "users.create";
				body: {
					id: number;
					name: string;
					age: number;
				};
				ok: boolean | null;
				headers: Headers;
				type: ResponseType;
				url: string;
				redirected: boolean;
				raw: Response;
				requestParams: PromiseRequestParams<{ params1: string }>;
				predicted: boolean;
			},
			"strict"
		>;
	})
	.then((value) => {
		type Check = ExpectType<
			typeof value,
			| E.Left<"request-error", RequestErrorContent>
			| E.Right<
				"response",
				| AllNotPredictedClientResponse<{ params1: string }>
				| {
					code: "422";
					information: "extract-error";
					body: undefined;
					ok: boolean | null;
					headers: Headers;
					type: ResponseType;
					url: string;
					redirected: boolean;
					raw: Response;
					requestParams: PromiseRequestParams<{ params1: string }>;
					predicted: boolean;
				}
				| {
					code: "200";
					information: "users.create";
					body: {
						id: number;
						name: string;
						age: number;
					};
					ok: boolean | null;
					headers: Headers;
					type: ResponseType;
					url: string;
					redirected: boolean;
					raw: Response;
					requestParams: PromiseRequestParams<{ params1: string }>;
					predicted: boolean;
				}
			>,
			"strict"
		>;
	});

void httpClient.post(
	"/documents",
	{
		body: createFormData({
			bool: true,
			myFile: new File([], "test"),
		}),
	},
);

void httpClient
	.get(
		"/documents/test",
		{
			hookParams: { params1: "" },
		},
	)
	.whenInformation("file.send", ({ body }) => {
		type Check = ExpectType<
			typeof body,
			undefined,
			"strict"
		>;
	});

void httpClient.get("/sse")
	.whenReceiveServerEvent(
		"message",
		(event, response) => {
			type Check = ExpectType<
				typeof event,
				{
					event: "message";
					data: {
						test: string;
					};
					id?: string | undefined;
					retry?: number | undefined;
				},
				"strict"
			>;
			type Check1 = ExpectType<
				typeof response,
				{
					code: "200";
					information: "ess";
					body: undefined;
					ok: boolean | null;
					headers: Headers;
					type: ResponseType;
					url: string;
					redirected: boolean;
					raw: globalThis.Response;
					requestParams: PromiseRequestParams<{
						params1: string;
					}>;
					predicted: boolean;
				} & ClientEventsResponseHandler<{
					event: "message";
					data: {
						test: string;
					};
					id?: string;
					retry?: number;
				} | {
					event: "ping";
					data: string;
					id?: string;
					retry?: number;
				}>,
				"strict"
			>;
		},
	)
	.whenExpectedResponse(
		(response) => {
			if (Symbol.asyncIterator in response) {
				response.onReceiveEvent(
					"message",
					(event, response) => {
						type Check = ExpectType<
							typeof event,
							{
								event: "message";
								data: {
									test: string;
								};
								id?: string | undefined;
								retry?: number | undefined;
							},
							"strict"
						>;

						type Check1 = ExpectType<
							typeof response,
							{
								code: "200";
								information: "ess";
								body: undefined;
								ok: boolean | null;
								headers: Headers;
								type: ResponseType;
								url: string;
								redirected: boolean;
								raw: globalThis.Response;
								requestParams: PromiseRequestParams<{
									params1: string;
								}>;
								predicted: boolean;
							} & ClientEventsResponseHandler<{
								event: "message";
								data: {
									test: string;
								};
								id?: string;
								retry?: number;
							} | {
								event: "ping";
								data: string;
								id?: string;
								retry?: number;
							}>,
							"strict"
						>;
					},
				);
			}
		},
	);

type Check1 = ExpectType<
	RemovePrefixPathServerRoute<
		AddPrefixPathServerRoute<
			FindServerRoute<Routes, "GET", "/users/{userId}">,
			"/titi/toto"
		>,
		"/titi/"
	>,
	{
		method: "GET";
		path: "toto/users/{userId}";
		params: {
			userId: number;
		};
		responses: {
			code: "422";
			information: "extract-error";
			body?: undefined;
		} | {
			code: "200";
			information: "users.find";
			body: {
				id: number;
				name: string;
				age: number;
			};
		};
	},
	"strict"
>;

type Check2 = ExpectType<
	FindServerRouteResponse<
		FindServerRoute<Routes, "GET", "/users/{userId}">,
		"information",
		"users.find"
	>,
	{
		code: "200";
		information: "users.find";
		body: {
			id: number;
			name: string;
			age: number;
		};
	},
	"strict"
>;
