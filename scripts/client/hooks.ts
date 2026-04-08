/* eslint-disable @typescript-eslint/prefer-for-of */
import { type CodeHook, type ErrorHook, type InformationHook, type NotPredictedResponseHook, type RequestHook, type ResponseHook, type ResponseTypeHook, type PromiseRequestParams, type NotPredictedClientResponse, type ClientResponse, type CloseServerEventHook, type ClientEventsResponse, type BeforeRetryServerEventHook, type ErrorServerEventHook, type StartServerEventHook, type ServerEvent, type ReceiveEventServerEventHook, type CloseStreamHook, type ClientStreamResponse, type ReceiveDataStreamHook, type ErrorStreamHook, type StartStreamHook, type ServerRouteResponseFlux } from "./types";

export async function launchRequestHook(
	clientHook: readonly RequestHook[],
	promiseRequestHook: readonly RequestHook[],
	requestParams: PromiseRequestParams,
): Promise<PromiseRequestParams> {
	let resultRequestParams = requestParams;

	for (let index = 0; index < promiseRequestHook.length; index++) {
		resultRequestParams = await promiseRequestHook[index]!(resultRequestParams);
	}

	for (let index = 0; index < clientHook.length; index++) {
		resultRequestParams = await clientHook[index]!(resultRequestParams);
	}

	return resultRequestParams;
}

export async function launchResponseHook(
	clientHook: readonly ResponseHook[],
	promiseRequestHook: readonly ResponseHook[],
	response: ClientResponse,
): Promise<ClientResponse> {
	let resultResponse = response;

	for (let index = 0; index < promiseRequestHook.length; index++) {
		resultResponse = await promiseRequestHook[index]!(resultResponse);
	}

	for (let index = 0; index < clientHook.length; index++) {
		resultResponse = await clientHook[index]!(resultResponse);
	}

	return resultResponse;
}

export async function launchInformationHook(
	clientHook: readonly InformationHook[],
	promiseRequestHook: readonly InformationHook[],
	response: ClientResponse,
) {
	for (let index = 0; index < promiseRequestHook.length; index++) {
		await promiseRequestHook[index]!(response);
	}

	for (let index = 0; index < clientHook.length; index++) {
		await clientHook[index]!(response);
	}
}

export async function launchCodeHook(
	clientHook: readonly CodeHook[],
	promiseRequestHook: readonly CodeHook[],
	response: ClientResponse,
) {
	for (let index = 0; index < promiseRequestHook.length; index++) {
		await promiseRequestHook[index]!(response);
	}

	for (let index = 0; index < clientHook.length; index++) {
		await clientHook[index]!(response);
	}
}

export async function launchResponseTypeHook(
	clientHook: readonly ResponseTypeHook[],
	promiseRequestHook: readonly ResponseTypeHook[],
	response: ClientResponse,
) {
	for (let index = 0; index < promiseRequestHook.length; index++) {
		await promiseRequestHook[index]!(response);
	}

	for (let index = 0; index < clientHook.length; index++) {
		await clientHook[index]!(response);
	}
}

export async function launchExpectedResponseHook(
	clientHook: readonly ResponseTypeHook[],
	promiseRequestHook: readonly ResponseTypeHook[],
	response: ClientResponse,
) {
	for (let index = 0; index < promiseRequestHook.length; index++) {
		await promiseRequestHook[index]!(response);
	}

	for (let index = 0; index < clientHook.length; index++) {
		await clientHook[index]!(response);
	}
}

export async function launchNotPredictedHook(
	clientHook: readonly NotPredictedResponseHook[],
	promiseRequestHook: readonly NotPredictedResponseHook[],
	response: NotPredictedClientResponse,
) {
	for (let index = 0; index < promiseRequestHook.length; index++) {
		await promiseRequestHook[index]!(response);
	}

	for (let index = 0; index < clientHook.length; index++) {
		await clientHook[index]!(response);
	}
}

export async function launchErrorHook(
	clientHook: readonly ErrorHook[],
	promiseRequestHook: readonly ErrorHook[],
	error: unknown,
	requestParams: PromiseRequestParams,
) {
	for (let index = 0; index < promiseRequestHook.length; index++) {
		await promiseRequestHook[index]!(error, requestParams);
	}

	for (let index = 0; index < clientHook.length; index++) {
		await clientHook[index]!(error, requestParams);
	}
}

export async function launchCloseServerEventHook(
	clientHook: readonly CloseServerEventHook[],
	promiseRequestHook: readonly CloseServerEventHook[],
	response: ClientEventsResponse,
) {
	for (let index = 0; index < promiseRequestHook.length; index++) {
		await promiseRequestHook[index]!(response);
	}

	for (let index = 0; index < clientHook.length; index++) {
		await clientHook[index]!(response);
	}
}

export async function launchBeforeRetryServerEventHook(
	clientHook: readonly BeforeRetryServerEventHook[],
	promiseRequestHook: readonly BeforeRetryServerEventHook[],
	response: ClientEventsResponse,
) {
	for (let index = 0; index < promiseRequestHook.length; index++) {
		await promiseRequestHook[index]!(response);
	}

	for (let index = 0; index < clientHook.length; index++) {
		await clientHook[index]!(response);
	}
}

export async function launchErrorServerEventHook(
	clientHook: readonly ErrorServerEventHook[],
	promiseRequestHook: readonly ErrorServerEventHook[],
	error: unknown,
	response: ClientEventsResponse,
) {
	for (let index = 0; index < promiseRequestHook.length; index++) {
		await promiseRequestHook[index]!(error, response);
	}

	for (let index = 0; index < clientHook.length; index++) {
		await clientHook[index]!(error, response);
	}
}

export async function launchStartServerEventHook(
	clientHook: readonly StartServerEventHook[],
	promiseRequestHook: readonly StartServerEventHook[],
	response: ClientEventsResponse,
) {
	for (let index = 0; index < promiseRequestHook.length; index++) {
		await promiseRequestHook[index]!(response);
	}

	for (let index = 0; index < clientHook.length; index++) {
		await clientHook[index]!(response);
	}
}

export async function launchReceiveEventServerEventHook(
	clientHook: readonly ReceiveEventServerEventHook[],
	promiseRequestHook: readonly ReceiveEventServerEventHook[],
	event: ServerEvent,
	response: ClientEventsResponse,
) {
	for (let index = 0; index < promiseRequestHook.length; index++) {
		await promiseRequestHook[index]!(event, response);
	}

	for (let index = 0; index < clientHook.length; index++) {
		await clientHook[index]!(event, response);
	}
}

export async function launchCloseStreamHook(
	clientHook: readonly CloseStreamHook[],
	promiseRequestHook: readonly CloseStreamHook[],
	response: ClientStreamResponse,
) {
	for (let index = 0; index < promiseRequestHook.length; index++) {
		await promiseRequestHook[index]!(response);
	}

	for (let index = 0; index < clientHook.length; index++) {
		await clientHook[index]!(response);
	}
}

export async function launchReceiveDataStreamHook(
	clientHook: readonly ReceiveDataStreamHook[],
	promiseRequestHook: readonly ReceiveDataStreamHook[],
	data: ServerRouteResponseFlux,
	response: ClientStreamResponse,
) {
	for (let index = 0; index < promiseRequestHook.length; index++) {
		await promiseRequestHook[index]!(data, response);
	}

	for (let index = 0; index < clientHook.length; index++) {
		await clientHook[index]!(data, response);
	}
}

export async function launchErrorStreamHook(
	clientHook: readonly ErrorStreamHook[],
	promiseRequestHook: readonly ErrorStreamHook[],
	error: unknown,
	response: ClientStreamResponse,
) {
	for (let index = 0; index < promiseRequestHook.length; index++) {
		await promiseRequestHook[index]!(error, response);
	}

	for (let index = 0; index < clientHook.length; index++) {
		await clientHook[index]!(error, response);
	}
}

export async function launchStartStreamHook(
	clientHook: readonly StartStreamHook[],
	promiseRequestHook: readonly StartStreamHook[],
	response: ClientStreamResponse,
) {
	for (let index = 0; index < promiseRequestHook.length; index++) {
		await promiseRequestHook[index]!(response);
	}

	for (let index = 0; index < clientHook.length; index++) {
		await clientHook[index]!(response);
	}
}
