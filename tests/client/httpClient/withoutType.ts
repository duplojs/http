import { type ClientResponse, createHttpClient, type RequestErrorContent, type NotPredictedClientResponse, type PromiseRequest, type PromiseRequestParams, type ServerRoute } from "@client";
import { createFormData, E, type ExpectType } from "@duplojs/utils";

const httpClient = createHttpClient<ServerRoute, { params1: string }>({
	baseUrl: "http://test.com",
});

const promiseRequest = httpClient
	.request({
		method: "GET",
		path: "/test",
	});

type Check = ExpectType<
	typeof promiseRequest,
	PromiseRequest<
		{
			params1: string;
		},
		ClientResponse<
			{
				params1: string;
			}
		>
	>,
	"strict"
>;

void promiseRequest
	.whenInformation("test", (value) => {
		type Check = ExpectType<
			typeof value,
			ClientResponse<{
				params1: string;
			}>,
			"strict"
		>;
	})
	.whenCode("200", (value) => {
		type Check = ExpectType<
			typeof value,
			ClientResponse<{
				params1: string;
			}>,
			"strict"
		>;
	})
	.whenInformationalResponse((value) => {
		type Check = ExpectType<
			typeof value,
			ClientResponse<{
				params1: string;
			}>,
			"strict"
		>;
	})
	.whenSuccessfulResponse((value) => {
		type Check = ExpectType<
			typeof value,
			ClientResponse<{
				params1: string;
			}>,
			"strict"
		>;
	})
	.whenRedirectionResponse((value) => {
		type Check = ExpectType<
			typeof value,
			ClientResponse<{
				params1: string;
			}>,
			"strict"
		>;
	})
	.whenClientErrorResponse((value) => {
		type Check = ExpectType<
			typeof value,
			ClientResponse<{
				params1: string;
			}>,
			"strict"
		>;
	})
	.whenServerErrorResponse((value) => {
		type Check = ExpectType<
			typeof value,
			ClientResponse<{
				params1: string;
			}>,
			"strict"
		>;
	})
	.whenExpectedResponse((value) => {
		type Check = ExpectType<
			typeof value,
			ClientResponse<{
				params1: string;
			}>,
			"strict"
		>;
	})
	.whenNotPredictedResponse((value) => {
		type Check = ExpectType<
			typeof value,
			NotPredictedClientResponse<{
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
	.iWantInformation("test")
	.then((value) => {
		if (E.isRight(value)) {
			type Check = ExpectType<
				typeof value,
				E.Right<"response", ClientResponse<{
					params1: string;
				}>>,
				"strict"
			>;
		} else {
			type Check = ExpectType<
				typeof value,
				E.Left<"request-error", RequestErrorContent> | E.Left<"unexpect-response", ClientResponse<{
					params1: string;
				}>>,
				"strict"
			>;
		}
	});

void promiseRequest
	.iWantCode("200")
	.then((value) => {
		if (E.isRight(value)) {
			type Check = ExpectType<
				typeof value,
				E.Right<"response", ClientResponse<{
					params1: string;
				}>>,
				"strict"
			>;
		} else {
			type Check = ExpectType<
				typeof value,
				E.Left<"request-error", RequestErrorContent> | E.Left<"unexpect-response", ClientResponse<{
					params1: string;
				}>>,
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
				E.Right<"response", ClientResponse<{
					params1: string;
				}>>,
				"strict"
			>;
		} else {
			type Check = ExpectType<
				typeof value,
				E.Left<"request-error", RequestErrorContent> | E.Left<"unexpect-response", ClientResponse<{
					params1: string;
				}>>,
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
				E.Right<"response", ClientResponse<{
					params1: string;
				}>>,
				"strict"
			>;
		} else {
			type Check = ExpectType<
				typeof value,
				E.Left<"request-error", RequestErrorContent> | E.Left<"unexpect-response", ClientResponse<{
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
				E.Right<"response", ClientResponse<{
					params1: string;
				}>>,
				"strict"
			>;
		} else {
			type Check = ExpectType<
				typeof value,
				E.Left<"request-error", RequestErrorContent> | E.Left<"unexpect-response", ClientResponse<{
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
				E.Right<"response", ClientResponse<{
					params1: string;
				}>>,
				"strict"
			>;
		} else {
			type Check = ExpectType<
				typeof value,
				E.Left<"request-error", RequestErrorContent> | E.Left<"unexpect-response", ClientResponse<{
					params1: string;
				}>>,
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
				E.Right<"response", ClientResponse<{
					params1: string;
				}>>,
				"strict"
			>;
		} else {
			type Check = ExpectType<
				typeof value,
				E.Left<"request-error", RequestErrorContent> | E.Left<"unexpect-response", ClientResponse<{
					params1: string;
				}>>,
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
				E.Right<"response", ClientResponse<{
					params1: string;
				}>>,
				"strict"
			>;
		} else {
			type Check = ExpectType<
				typeof value,
				E.Left<"request-error", RequestErrorContent> | E.Left<"unexpect-response", ClientResponse<{
					params1: string;
				}>>,
				"strict"
			>;
		}
	});

void promiseRequest
	.iWantInformationOrThrow("test")
	.then((value) => {
		type Check = ExpectType<
			typeof value,
			ClientResponse<{
				params1: string;
			}>,
			"strict"
		>;
	});

void promiseRequest
	.iWantCodeOrThrow("200")
	.then((value) => {
		type Check = ExpectType<
			typeof value,
			ClientResponse<{
				params1: string;
			}>,
			"strict"
		>;
	});

void promiseRequest
	.iWantInformationalResponseOrThrow()
	.then((value) => {
		type Check = ExpectType<
			typeof value,
			ClientResponse<{
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
			ClientResponse<{
				params1: string;
			}>,
			"strict"
		>;
	});

void promiseRequest
	.iWantRedirectionResponseOrThrow()
	.then((value) => {
		type Check = ExpectType<
			typeof value,
			ClientResponse<{
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
			ClientResponse<{
				params1: string;
			}>,
			"strict"
		>;
	});

void promiseRequest
	.iWantServerErrorResponseOrThrow()
	.then((value) => {
		type Check = ExpectType<
			typeof value,
			ClientResponse<{
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
			ClientResponse<{
				params1: string;
			}>,
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
					| ClientResponse<{
						params1: string;
					}>
					| NotPredictedClientResponse<{
						params1: string;
					}>
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

void httpClient.get("/test")
	.whenInformation("test", (value) => {
		type Check = ExpectType<
			typeof value,
			ClientResponse<{
				params1: string;
			}>,
			"strict"
		>;
	})
	.then((value) => {
		type Check = ExpectType<
			typeof value,
			| E.Left<"request-error", RequestErrorContent>
			| E.Right<
				"response",
				| ClientResponse<{ params1: string }>
				| NotPredictedClientResponse<{ params1: string }>
			>,
			"strict"
		>;
	});

void httpClient.get("/test", { body: "" })
	.whenInformation("test", (value) => {
		type Check = ExpectType<
			typeof value,
			ClientResponse<{
				params1: string;
			}>,
			"strict"
		>;
	})
	.then((value) => {
		type Check = ExpectType<
			typeof value,
			| E.Left<"request-error", RequestErrorContent>
			| E.Right<
				"response",
				| ClientResponse<{ params1: string }>
				| NotPredictedClientResponse<{ params1: string }>
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
