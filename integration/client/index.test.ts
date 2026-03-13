import { hub } from "@core";
import { createHttpServer } from "@duplojs/http/node";
import { type AllNotPredictedClientResponse, createHttpClient, type PromiseRequestParams, type RequestErrorContent } from "@duplojs/http/client";
import { type Routes } from "./clientType";
import { A, asserts, createFormData, E, S, sleep, stringToBytes, type ExpectType } from "@duplojs/utils";
import { createFileToSend } from "@utils";
import { resolve } from "path";
import { SF } from "@duplojs/server-utils";

describe("node server", async() => {
	const server = await createHttpServer(hub, {
		host: "0.0.0.0",
		port: 8946,
		uploadFolder: resolve(import.meta.dirname, "../files/upload"),
	});

	process.chdir(resolve(import.meta.dirname, "../"));

	afterAll(() => {
		server.close();
	});

	const httpClient = createHttpClient<Routes>({
		baseUrl: "http://localhost:8946",
	});

	it("get all users", async() => {
		const result = await httpClient.get("/users");

		type Check = ExpectType<
			typeof result,
			| E.Left<"request-error", RequestErrorContent>
			| E.Right<
				"response",
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
					requestParams: PromiseRequestParams<Record<string, unknown>>;
					predicted: boolean;
				}
				| AllNotPredictedClientResponse<
					Record<string, unknown>
				>
			>,
			"strict"
		>;

		expect(result).toStrictEqual(
			E.right(
				"response",
				expect.objectContaining({
					url: "http://localhost:8946/users",
					information: "users.findMany",
					body: [
						{
							age: 28,
							id: 23,
							name: "",
						},
					],
					predicted: true,
				}),
			),
		);
	});

	it("get user", async() => {
		const result = await httpClient.get("/users/{userId}", { params: { userId: S.to(15) } });

		type Check = ExpectType<
			typeof result,
			| E.Left<"request-error", RequestErrorContent>
			| E.Right<
				"response",
				| AllNotPredictedClientResponse<
					Record<string, unknown>
				>
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
					requestParams: PromiseRequestParams<Record<string, unknown>>;
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
					requestParams: PromiseRequestParams<Record<string, unknown>>;
					predicted: boolean;
				}
			>,
			"strict"
		>;

		expect(result).toStrictEqual(
			E.right(
				"response",
				expect.objectContaining({
					url: "http://localhost:8946/users/15",
					information: "users.find",
					body: {
						age: 28,
						id: 15,
						name: "",
					},
					predicted: true,
				}),
			),
		);
	});

	it("post user", async() => {
		const result = await httpClient.post("/users", {
			body: {
				id: 5,
				name: "math",
				age: 23,
			},
		});

		type Check = ExpectType<
			typeof result,
			| E.Left<"request-error", RequestErrorContent>
			| E.Right<
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
					requestParams: PromiseRequestParams<Record<string, unknown>>;
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
					requestParams: PromiseRequestParams<Record<string, unknown>>;
					predicted: boolean;
				}
				| AllNotPredictedClientResponse<
					Record<string, unknown>
				>
			>,
			"strict"
		>;

		expect(result).toStrictEqual(
			E.right(
				"response",
				expect.objectContaining({
					url: "http://localhost:8946/users",
					information: "users.create",
					body: {
						id: 5,
						name: "math",
						age: 23,
					},
					predicted: true,
				}),
			),
		);
	});

	it("post document", async() => {
		const result = await httpClient.post("/documents", {
			body: createFormData({
				bool: true,
				myFile: [await createFileToSend("files/fakeFiles/1mb.jpg", "//😄.jpg")],
				name: "client/testClient.generate",
			}),
		});

		type Check = ExpectType<
			typeof result,
			| E.Left<"request-error", RequestErrorContent>
			| E.Right<
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
					requestParams: PromiseRequestParams<Record<string, unknown>>;
					predicted: boolean;
				}
				| {
					code: "204";
					information: "file.receive";
					body: undefined;
					ok: boolean | null;
					headers: Headers;
					type: ResponseType;
					url: string;
					redirected: boolean;
					raw: Response;
					requestParams: PromiseRequestParams<Record<string, unknown>>;
					predicted: boolean;
				}
				| AllNotPredictedClientResponse<
					Record<string, unknown>
				>
			>,
			"strict"
		>;

		expect(result).toStrictEqual(
			E.right(
				"response",
				expect.objectContaining({
					url: "http://localhost:8946/documents",
					information: "file.receive",
					predicted: true,
				}),
			),
		);

		await sleep(500);

		expect(await SF.stat("files/store/client/testClient.generate.jpg")).toStrictEqual(
			E.success(
				expect.objectContaining({ sizeBytes: stringToBytes("1mb") }),
			),
		);
		asserts(await SF.remove("files/store/client/testClient.generate.jpg"), E.isRight);
		expect(await SF.readDirectory("files/upload")).toStrictEqual(
			E.success([".gitkeep"]),
		);
	});

	describe("server sent events", () => {
		it("stream and retry 2 time", async() => {
			const spyClientMessage = vi.fn();
			const spyClientOther = vi.fn();
			const spyMessage = vi.fn();
			const spyOther = vi.fn();
			const spyAllEvent = vi.fn();

			const result = await httpClient
				.get("/sse")
				.whenReceiveServerEvent("message", spyClientMessage)
				.whenReceiveServerEvent("other", spyClientOther)
				.iWantInformationOrThrow("super-sse");

			void result
				.onStreamEvent("receiveServerEvents", spyAllEvent)
				.onReceiveEvent("message", spyMessage)
				.onReceiveEvent("other", spyOther)
				.consumeEventStream();

			await sleep(1000);
			result.closeEventStream();

			const event1 = {
				event: "message",
				id: undefined,
				retry: 100,
				data: { test: "1" },
			};

			const event2 = {
				event: "message",
				id: "test",
				retry: undefined,
				data: { test: "2" },
			};

			const event3 = {
				event: "other",
				id: undefined,
				retry: undefined,
				data: "3",
			};

			expect(spyAllEvent).toHaveBeenCalledTimes(6);
			expect(spyAllEvent).toHaveBeenNthCalledWith(1, event1, expect.any(Object));
			expect(spyAllEvent).toHaveBeenNthCalledWith(2, event2, expect.any(Object));
			expect(spyAllEvent).toHaveBeenNthCalledWith(3, event3, expect.any(Object));
			expect(spyAllEvent).toHaveBeenNthCalledWith(4, event1, expect.any(Object));
			expect(spyAllEvent).toHaveBeenNthCalledWith(5, event2, expect.any(Object));
			expect(spyAllEvent).toHaveBeenNthCalledWith(6, event3, expect.any(Object));

			expect(spyClientMessage).toHaveBeenCalledTimes(4);
			expect(spyClientMessage).toHaveBeenNthCalledWith(1, event1, expect.any(Object));
			expect(spyClientMessage).toHaveBeenNthCalledWith(2, event2, expect.any(Object));
			expect(spyClientMessage).toHaveBeenNthCalledWith(3, event1, expect.any(Object));
			expect(spyClientMessage).toHaveBeenNthCalledWith(4, event2, expect.any(Object));

			expect(spyMessage).toHaveBeenCalledTimes(4);
			expect(spyMessage).toHaveBeenNthCalledWith(1, event1, expect.any(Object));
			expect(spyMessage).toHaveBeenNthCalledWith(2, event2, expect.any(Object));
			expect(spyMessage).toHaveBeenNthCalledWith(3, event1, expect.any(Object));
			expect(spyMessage).toHaveBeenNthCalledWith(4, event2, expect.any(Object));

			expect(spyClientOther).toHaveBeenCalledTimes(2);
			expect(spyClientOther).toHaveBeenNthCalledWith(1, event3, expect.any(Object));
			expect(spyOther).toHaveBeenNthCalledWith(1, event3, expect.any(Object));

			expect(spyOther).toHaveBeenCalledTimes(2);
			expect(spyOther).toHaveBeenNthCalledWith(1, event3, expect.any(Object));
			expect(spyOther).toHaveBeenNthCalledWith(1, event3, expect.any(Object));
		});

		it("cancel reconnection", async() => {
			const result = await httpClient
				.get("/sse")
				.iWantInformationOrThrow("super-sse");

			result.onStreamEvent(
				"beforeRetry",
				(response) => void response.closeEventStream(),
			);

			await expect(A.from(result)).resolves.toStrictEqual([
				{
					data: {
						test: "1",
					},
					event: "message",
					id: undefined,
					retry: 100,
				},
				{
					data: {
						test: "2",
					},
					event: "message",
					id: "test",
					retry: undefined,
				},
				{
					data: "3",
					event: "other",
					id: undefined,
					retry: undefined,
				},
			]);
		});
	});
});
