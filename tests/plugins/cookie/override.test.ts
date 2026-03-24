import "@plugin-cookie/override";
import { Request } from "@core/request";
import { Response } from "@core/response";
import { D, type ExpectType } from "@duplojs/utils";
import type { SerializerParams } from "@plugin-cookie";
import { createBodyReader } from "@test-utils/bodyReader";

describe("cookie override", () => {
	it("adds isolated cookies storage on Request instances", () => {
		const firstRequest = new Request({
			method: "GET",
			headers: {},
			url: "http://localhost/test",
			host: "localhost",
			origin: "http://localhost",
			matchedPath: null,
			params: {},
			path: "/test",
			query: {},
			bodyReader: createBodyReader(),
		});
		const secondRequest = new Request({
			method: "GET",
			headers: {},
			url: "http://localhost/test",
			host: "localhost",
			origin: "http://localhost",
			matchedPath: null,
			params: {},
			path: "/test",
			query: {},
			bodyReader: createBodyReader(),
		});

		type Check = ExpectType<
			typeof firstRequest.cookies,
			Partial<Record<string, string>> | undefined,
			"strict"
		>;

		expect(firstRequest.cookies).toBeUndefined();
		expect(secondRequest.cookies).toBeUndefined();

		firstRequest.cookies = {
			session: "first",
		};

		expect(firstRequest.cookies).toStrictEqual(
			{
				session: "first",
			},
		);
		expect(secondRequest.cookies).toBeUndefined();
		expect(Object.getPrototypeOf(firstRequest.cookies)).toBe(Object.prototype);
	});

	it("supports replacing cookies storage on Request instances", () => {
		const request = new Request({
			method: "GET",
			headers: {},
			url: "http://localhost/test",
			host: "localhost",
			origin: "http://localhost",
			matchedPath: null,
			params: {},
			path: "/test",
			query: {},
			bodyReader: createBodyReader(),
		});
		const replacement = {
			session: "assigned",
		};

		request.cookies = replacement;

		expect(request.cookies).toBe(replacement);
		expect(Object.getPrototypeOf(request.cookies)).toBe(Object.prototype);
	});

	it("adds isolated cookie storage and helpers on Response instances", () => {
		const firstResponse = new Response("200", "ok", undefined);
		const secondResponse = new Response("200", "ok", undefined);

		type CookieCheck = ExpectType<
			typeof firstResponse.cookie,
			| Record<string, {
				value: string;
				params?: SerializerParams;
			}>
			| undefined,
			"strict"
		>;

		expect(firstResponse.cookie).toBeUndefined();
		expect(secondResponse.cookie).toBeUndefined();

		const returnedBySet = firstResponse.setCookie(
			"session",
			"value",
			{
				expireIn: D.createTime(1, "hour"),
				httpOnly: true,
			},
		);
		const returnedByDrop = firstResponse.dropCookie("expired");

		expect(firstResponse.cookie).toStrictEqual(
			{
				session: {
					value: "value",
					params: {
						expireIn: D.createTime(1, "hour"),
						httpOnly: true,
					},
				},
				expired: {
					value: "",
					params: {
						maxAge: 0,
					},
				},
			},
		);
		expect(secondResponse.cookie).toBeUndefined();
		expect(Object.getPrototypeOf(firstResponse.cookie)).toBe(Object.prototype);
	});

	it("supports replacing cookie storage on Response instances", () => {
		const response = new Response("200", "ok", undefined);
		const replacement = {
			session: {
				value: "assigned",
				params: {
					maxAge: 10,
				},
			},
		};

		response.cookie = replacement;

		expect(response.cookie).toBe(replacement);
		expect(Object.getPrototypeOf(response.cookie)).toBe(Object.prototype);
	});

	it("initializes cookie storage when dropping a cookie on a fresh Response", () => {
		const response = new Response("200", "ok", undefined);

		response.dropCookie("session");

		expect(response.cookie).toStrictEqual(
			{
				session: {
					value: "",
					params: {
						maxAge: 0,
					},
				},
			},
		);
		expect(Object.getPrototypeOf(response.cookie)).toBe(Object.prototype);
	});
});
