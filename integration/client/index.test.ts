import { hub } from "@core";
import { createHttpServer } from "@duplojs/http/node";
import { createHttpClient, type NotPredictedClientResponse, type PromiseRequestParams, type RequestErrorContent } from "@duplojs/http/client";
import { type Routes } from "./clientType";
import { E, S, type ExpectType } from "@duplojs/utils";

describe("node server", async() => {
	const server = await createHttpServer(hub, {
		host: "0.0.0.0",
		port: 8946,
	});

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
			| E.EitherLeft<"request-error", RequestErrorContent>
			| E.EitherRight<
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
				| NotPredictedClientResponse<
					PromiseRequestParams<Record<string, unknown>>
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
			| E.EitherLeft<"request-error", RequestErrorContent>
			| E.EitherRight<
				"response",
				| NotPredictedClientResponse<
					PromiseRequestParams<Record<string, unknown>>
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

	it("port user", async() => {
		const result = await httpClient.post("/users", {
			body: {
				id: 5,
				name: "math",
				age: 23,
			},
		});

		type Check = ExpectType<
			typeof result,
			| E.EitherLeft<"request-error", RequestErrorContent>
			| E.EitherRight<
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
				| NotPredictedClientResponse<
					PromiseRequestParams<Record<string, unknown>>
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
});
