import {
	launchRequestHook,
	launchResponseHook,
	launchInformationHook,
	launchCodeHook,
	launchResponseTypeHook,
	launchExpectedResponseHook,
	launchNotPredictedHook,
	launchErrorHook,
	type RequestHook,
	type ResponseHook,
	type InformationHook,
	type CodeHook,
	type NotPredictedResponseHook,
	type ResponseTypeHook,
	type ErrorHook,
	type ClientResponse,
	type PromiseRequestParams,
	launchCloseServerEventHook,
	type CloseServerEventHook,
	launchBeforeRetryServerEventHook,
	launchErrorServerEventHook,
	launchStartServerEventHook,
	launchReceiveEventServerEventHook,
} from "@client";

describe("client hooks", () => {
	it("launchRequestHook runs promise hooks before client hooks and returns latest params", async() => {
		const order: string[] = [];
		const baseParams = {
			method: "GET",
			path: "/start",
		} as PromiseRequestParams;

		const promiseHooks: RequestHook[] = [
			(params) => {
				order.push("promise-1");
				return {
					...params,
					path: "/promise",
				};
			},
			(params) => {
				order.push("promise-2");
				return {
					...params,
					method: "POST",
				};
			},
		];

		const clientHooks: RequestHook[] = [
			(params) => {
				order.push("client-1");
				return {
					...params,
					path: "/client",
				};
			},
		];

		const result = await launchRequestHook(clientHooks, promiseHooks, baseParams);

		expect(order).toStrictEqual(["promise-1", "promise-2", "client-1"]);
		expect(result).toMatchObject({
			method: "POST",
			path: "/client",
		});
	});

	it("launchResponseHook runs promise hooks before client hooks and returns latest response", async() => {
		const order: string[] = [];
		const baseResponse = { code: "200" } as unknown as ClientResponse;

		const promiseHooks: ResponseHook[] = [
			(response) => {
				order.push("promise-1");
				return {
					...response,
					code: "201",
				} as ClientResponse;
			},
		];

		const clientHooks: ResponseHook[] = [
			(response) => {
				order.push("client-1");
				return {
					...response,
					code: "202",
				} as ClientResponse;
			},
		];

		const result = await launchResponseHook(clientHooks, promiseHooks, baseResponse);

		expect(order).toStrictEqual(["promise-1", "client-1"]);
		expect(result.code).toBe("202");
	});

	it("launchInformationHook runs promise hooks before client hooks", async() => {
		const order: string[] = [];
		const response = { code: "200" } as unknown as ClientResponse;

		const promiseHooks: InformationHook[] = [
			(response) => {
				order.push(`promise-${response.code}`);
			},
		];

		const clientHooks: InformationHook[] = [
			(response) => {
				order.push(`client-${response.code}`);
			},
		];

		await launchInformationHook(clientHooks, promiseHooks, response);

		expect(order).toStrictEqual(["promise-200", "client-200"]);
	});

	it("launchCodeHook runs promise hooks before client hooks", async() => {
		const order: string[] = [];
		const response = { code: "204" } as unknown as ClientResponse;

		const promiseHooks: CodeHook[] = [
			() => {
				order.push("promise");
			},
		];

		const clientHooks: CodeHook[] = [
			() => {
				order.push("client");
			},
		];

		await launchCodeHook(clientHooks, promiseHooks, response);

		expect(order).toStrictEqual(["promise", "client"]);
	});

	it("launchResponseTypeHook runs promise hooks before client hooks", async() => {
		const order: string[] = [];
		const response = { code: "302" } as unknown as ClientResponse;

		const promiseHooks: ResponseTypeHook[] = [
			() => {
				order.push("promise");
			},
		];

		const clientHooks: ResponseTypeHook[] = [
			() => {
				order.push("client");
			},
		];

		await launchResponseTypeHook(clientHooks, promiseHooks, response);

		expect(order).toStrictEqual(["promise", "client"]);
	});

	it("launchExpectedResponseHook runs promise hooks before client hooks", async() => {
		const order: string[] = [];
		const response = { code: "404" } as unknown as ClientResponse;

		const promiseHooks: ResponseTypeHook[] = [
			() => {
				order.push("promise");
			},
		];

		const clientHooks: ResponseTypeHook[] = [
			() => {
				order.push("client");
			},
		];

		await launchExpectedResponseHook(clientHooks, promiseHooks, response);

		expect(order).toStrictEqual(["promise", "client"]);
	});

	it("launchNotPredictedHook runs promise hooks before client hooks", async() => {
		const order: string[] = [];
		const response = {
			code: "200",
			predicted: false,
		} as unknown as ClientResponse;

		const promiseHooks: NotPredictedResponseHook[] = [
			() => {
				order.push("promise");
			},
		];

		const clientHooks: NotPredictedResponseHook[] = [
			() => {
				order.push("client");
			},
		];

		await launchNotPredictedHook(clientHooks, promiseHooks, response as never);

		expect(order).toStrictEqual(["promise", "client"]);
	});

	it("launchErrorHook runs promise hooks before client hooks with error and params", async() => {
		const order: string[] = [];
		const error = new Error("boom");
		const requestParams = {
			method: "GET",
			path: "/",
		} as PromiseRequestParams;

		const promiseHooks: ErrorHook[] = [
			(err, params) => {
				order.push(`promise-${(err as Error).message}-${params.path}`);
			},
		];

		const clientHooks: ErrorHook[] = [
			(err, params) => {
				order.push(`client-${(err as Error).message}-${params.path}`);
			},
		];

		await launchErrorHook(clientHooks, promiseHooks, error, requestParams);

		expect(order).toStrictEqual(["promise-boom-/", "client-boom-/"]);
	});

	it("launchCloseServerEventHook runs promise hooks before client hooks", async() => {
		const order: string[] = [];
		const response = {
			code: "200",
			predicted: false,
		} as unknown as ClientResponse;

		const promiseHooks = [
			() => {
				order.push("promise");
			},
		];

		const clientHooks = [
			() => {
				order.push("client");
			},
		];

		await launchCloseServerEventHook(clientHooks, promiseHooks, response as never);

		expect(order).toStrictEqual(["promise", "client"]);
	});

	it("launchBeforeRetryServerEventHook runs promise hooks before client hooks", async() => {
		const order: string[] = [];
		const response = {
			code: "200",
			predicted: false,
		} as unknown as ClientResponse;

		const promiseHooks = [
			() => {
				order.push("promise");
			},
		];

		const clientHooks = [
			() => {
				order.push("client");
			},
		];

		await launchBeforeRetryServerEventHook(clientHooks, promiseHooks, response as never);

		expect(order).toStrictEqual(["promise", "client"]);
	});

	it("launchErrorServerEventHook runs promise hooks before client hooks", async() => {
		const order: string[] = [];
		const response = {
			code: "200",
			predicted: false,
		} as unknown as ClientResponse;

		const promiseHooks = [
			() => {
				order.push("promise");
			},
		];

		const clientHooks = [
			() => {
				order.push("client");
			},
		];

		await launchErrorServerEventHook(clientHooks, promiseHooks, {}, response as never);

		expect(order).toStrictEqual(["promise", "client"]);
	});

	it("launchStartServerEventHook runs promise hooks before client hooks", async() => {
		const order: string[] = [];
		const response = {
			code: "200",
			predicted: false,
		} as unknown as ClientResponse;

		const promiseHooks = [
			() => {
				order.push("promise");
			},
		];

		const clientHooks = [
			() => {
				order.push("client");
			},
		];

		await launchStartServerEventHook(clientHooks, promiseHooks, response as never);

		expect(order).toStrictEqual(["promise", "client"]);
	});

	it("launchReceiveEventServerEventHook runs promise hooks before client hooks", async() => {
		const order: string[] = [];
		const response = {
			code: "200",
			predicted: false,
		} as unknown as ClientResponse;

		const promiseHooks = [
			() => {
				order.push("promise");
			},
		];

		const clientHooks = [
			() => {
				order.push("client");
			},
		];

		await launchReceiveEventServerEventHook(clientHooks, promiseHooks, {} as never, response as never);

		expect(order).toStrictEqual(["promise", "client"]);
	});
});
