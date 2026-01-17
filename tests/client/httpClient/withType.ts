import { type ClientResponse, createHttpClient, type RequestErrorContent, type NotPredictedClientResponse, type PromiseRequest, type PromiseRequestParams } from "@client";
import { E, S, type ExpectType } from "@duplojs/utils";

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
		PromiseRequestParams<{
			params1: string;
		}>,
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
			ClientResponse<PromiseRequestParams<{
				params1: string;
			}>>,
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
			ClientResponse<PromiseRequestParams<{
				params1: string;
			}>>,
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
			ClientResponse<PromiseRequestParams<{
				params1: string;
			}>>,
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
			NotPredictedClientResponse<PromiseRequestParams<{
				params1: string;
			}>>,
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
				E.EitherRight<"response", {
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
				E.EitherLeft<"request-error", RequestErrorContent> | E.EitherLeft<"unexpect-response", {
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
		}
	});

void promiseRequest
	.iWantCode("422")
	.then((value) => {
		if (E.isRight(value)) {
			type Check = ExpectType<
				typeof value,
				E.EitherRight<"response", {
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
				E.EitherLeft<"request-error", RequestErrorContent> | E.EitherLeft<"unexpect-response", {
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
		}
	});

void promiseRequest
	.iWantInformationalResponse()
	.then((value) => {
		if (E.isRight(value)) {
			type Check = ExpectType<
				typeof value,
				E.EitherRight<"response", ClientResponse<PromiseRequestParams<{
					params1: string;
				}>>>,
				"strict"
			>;
		} else {
			type Check = ExpectType<
				typeof value,
				E.EitherLeft<"request-error", RequestErrorContent> | E.EitherLeft<"unexpect-response", ClientResponse<PromiseRequestParams<{
					params1: string;
				}>>>,
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
				E.EitherRight<"response", {
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
				E.EitherLeft<"request-error", RequestErrorContent> | E.EitherLeft<"unexpect-response", {
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
		}
	});

void promiseRequest
	.iWantRedirectionResponse()
	.then((value) => {
		if (E.isRight(value)) {
			type Check = ExpectType<
				typeof value,
				E.EitherRight<"response", ClientResponse<PromiseRequestParams<{
					params1: string;
				}>>>,
				"strict"
			>;
		} else {
			type Check = ExpectType<
				typeof value,
				E.EitherLeft<"request-error", RequestErrorContent> | E.EitherLeft<"unexpect-response", ClientResponse<PromiseRequestParams<{
					params1: string;
				}>>>,
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
				E.EitherRight<"response", {
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
				E.EitherLeft<"request-error", RequestErrorContent> | E.EitherLeft<"unexpect-response", {
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
		}
	});

void promiseRequest
	.iWantServerErrorResponse()
	.then((value) => {
		if (E.isRight(value)) {
			type Check = ExpectType<
				typeof value,
				E.EitherRight<"response", ClientResponse<PromiseRequestParams<{
					params1: string;
				}>>>,
				"strict"
			>;
		} else {
			type Check = ExpectType<
				typeof value,
				E.EitherLeft<"request-error", RequestErrorContent> | E.EitherLeft<"unexpect-response", ClientResponse<PromiseRequestParams<{
					params1: string;
				}>>>,
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
				E.EitherRight<"response", {
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
				E.EitherLeft<"request-error", RequestErrorContent> | E.EitherLeft<"unexpect-response", ClientResponse<PromiseRequestParams<{
					params1: string;
				}>>>,
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
			ClientResponse<PromiseRequestParams<{
				params1: string;
			}>>,
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
			ClientResponse<PromiseRequestParams<{
				params1: string;
			}>>,
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
			ClientResponse<PromiseRequestParams<{
				params1: string;
			}>>,
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
	.then((value) => {
		if (E.isRight(value)) {
			type Check = ExpectType<
				typeof value,
				E.EitherRight<
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
					| NotPredictedClientResponse<PromiseRequestParams<{ params1: string }>>
				>,
				"strict"
			>;
		} else {
			type Check = ExpectType<
				typeof value,
				E.EitherLeft<"request-error", RequestErrorContent>,
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
			| E.EitherLeft<"request-error", RequestErrorContent>
			| E.EitherRight<
				"response",
				| NotPredictedClientResponse<PromiseRequestParams<{ params1: string }>>
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
			| E.EitherLeft<"request-error", RequestErrorContent>
			| E.EitherRight<
				"response",
				| NotPredictedClientResponse<PromiseRequestParams<{ params1: string }>>
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
