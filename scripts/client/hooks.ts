/* eslint-disable @typescript-eslint/prefer-for-of */
import { type CodeHook, type ErrorHook, type InformationHook, type NotPredictedResponseHook, type RequestHook, type ResponseHook, type ResponseTypeHook, type PromiseRequestParams, type NotPredictedClientResponse, type ClientResponse } from "./types";

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
