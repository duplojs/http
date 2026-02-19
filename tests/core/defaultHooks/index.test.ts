import { createHub, HookResponse, type HttpServerParams, initDefaultHook, PredictedResponse, Response } from "@core";
import { SF } from "@duplojs/server-utils";

describe("defaultHook", () => {
	const defaultHook = initDefaultHook(
		createHub({ environment: "DEV" }),
		{
			fromHookHeaderKey: "from-hook",
			informationHeaderKey: "information",
			predictedHeaderKey: "predicted",
		} as HttpServerParams,
	);

	it("beforeSendResponse set information et predicted headers", () => {
		const response = new PredictedResponse("100", "superInfo", undefined);
		defaultHook.beforeSendResponse({
			currentResponse: response,
			next: () => ({}) as any,
			request: {} as any,
			exit: {} as any,
		});
		expect(response.headers).toStrictEqual({
			information: "superInfo",
			predicted: "1",
		});
	});

	it("beforeSendResponse send string", () => {
		const response = new PredictedResponse("100", "superInfo", "superBody");
		defaultHook.beforeSendResponse({
			currentResponse: response,
			next: () => ({}) as any,
			request: {} as any,
			exit: {} as any,
		});
		expect(response.headers).toStrictEqual({
			information: "superInfo",
			predicted: "1",
			"content-type": "text/plain; charset=utf-8",
		});
	});

	it("beforeSendResponse send error", () => {
		const response = new PredictedResponse("100", "superInfo", new Error("super error"));
		defaultHook.beforeSendResponse({
			currentResponse: response,
			next: () => ({}) as any,
			request: {} as any,
			exit: {} as any,
		});
		expect(response.headers).toStrictEqual({
			information: "superInfo",
			predicted: "1",
			"content-type": "text/plain; charset=utf-8",
		});
	});

	it("beforeSendResponse send html file", () => {
		const response = new PredictedResponse("100", "superInfo", SF.createFileInterface("test.html"));

		defaultHook.beforeSendResponse({
			currentResponse: response,
			next: () => ({}) as any,
			request: {} as any,
			exit: {} as any,
		});

		expect(response.headers).toStrictEqual({
			information: "superInfo",
			predicted: "1",
			"content-disposition": "attachment; filename=\"test.html\"",
			"content-type": "text/html",
		});
	});

	it("beforeSendResponse send unknown file", () => {
		const response = new PredictedResponse("100", "superInfo", SF.createFileInterface("test"));

		defaultHook.beforeSendResponse({
			currentResponse: response,
			next: () => ({}) as any,
			request: {} as any,
			exit: {} as any,
		});

		expect(response.headers).toStrictEqual({
			information: "superInfo",
			predicted: "1",
			"content-disposition": "attachment; filename=\"test\"",
			"content-type": "application/octet-stream",
		});
	});

	it("beforeSendResponse send file with unknown name", () => {
		const response = new PredictedResponse("100", "superInfo", SF.createFileInterface("test/"));

		defaultHook.beforeSendResponse({
			currentResponse: response,
			next: () => ({}) as any,
			request: {} as any,
			exit: {} as any,
		});

		expect(response.headers).toStrictEqual({
			information: "superInfo",
			predicted: "1",
			"content-disposition": "attachment;",
			"content-type": "application/octet-stream",
		});
	});

	it("beforeSendResponse expect application/json content-type", () => {
		const responseNull = new PredictedResponse("100", "superInfo", null);
		defaultHook.beforeSendResponse({
			currentResponse: responseNull,
			next: () => ({}) as any,
			request: {} as any,
			exit: {} as any,
		});
		expect(responseNull.headers).toStrictEqual({
			information: "superInfo",
			predicted: "1",
			"content-type": "application/json; charset=utf-8",
		});

		const responseObject = new PredictedResponse("100", "superInfo", {});
		defaultHook.beforeSendResponse({
			currentResponse: responseObject,
			next: () => ({}) as any,
			request: {} as any,
			exit: {} as any,
		});
		expect(responseObject.headers).toStrictEqual({
			information: "superInfo",
			predicted: "1",
			"content-type": "application/json; charset=utf-8",
		});

		const responseBoolean = new PredictedResponse("100", "superInfo", true);
		defaultHook.beforeSendResponse({
			currentResponse: responseBoolean,
			next: () => ({}) as any,
			request: {} as any,
			exit: {} as any,
		});
		expect(responseBoolean.headers).toStrictEqual({
			information: "superInfo",
			predicted: "1",
			"content-type": "application/json; charset=utf-8",
		});

		const responseNumber = new PredictedResponse("100", "superInfo", 10);
		defaultHook.beforeSendResponse({
			currentResponse: responseNumber,
			next: () => ({}) as any,
			request: {} as any,
			exit: {} as any,
		});
		expect(responseNumber.headers).toStrictEqual({
			information: "superInfo",
			predicted: "1",
			"content-type": "application/json; charset=utf-8",
		});
	});

	it("beforeSendResponse send HookResponse", () => {
		const response = new HookResponse("afterSendResponse", "100", "superInfo", null);

		defaultHook.beforeSendResponse({
			currentResponse: response,
			next: () => ({}) as any,
			request: {} as any,
			exit: {} as any,
		});

		expect(response.headers).toStrictEqual({
			information: "superInfo",
			"content-type": "application/json; charset=utf-8",
			"from-hook": "afterSendResponse",
		});
	});

	it("beforeSendResponse not redefine content-type", () => {
		const response = new Response("100", "superInfo", null).setHeader("content-type", "test");

		defaultHook.beforeSendResponse({
			currentResponse: response,
			next: () => ({}) as any,
			request: {} as any,
			exit: {} as any,
		});

		expect(response.headers).toStrictEqual({
			information: "superInfo",
			"content-type": "test",
		});
	});
});
