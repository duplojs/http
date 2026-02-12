import { createCoreLibKind, Request } from "@core";
import { E, kindHeritage } from "@duplojs/utils";
import { createBodyReader } from "@test-utils/bodyReader";
import { visitNode } from "typescript";

describe("Request", () => {
	it("construct", () => {
		const bodyReader = createBodyReader();
		expect({
			...new Request({
				method: "GET",
				headers: { host: "example.com" },
				url: "https://example.com/path?query=1",
				host: "example.com",
				origin: "https://example.com",
				matchedPath: null,
				params: {},
				path: "/path",
				query: { query: "1" },
				bodyReader,
				...({
					test: "value",
				}),
			}),
		}).toStrictEqual({
			"@duplojs/utils/kind/@DuplojsHttpCore/request": null,
			method: "GET",
			headers: { host: "example.com" },
			url: "https://example.com/path?query=1",
			host: "example.com",
			origin: "https://example.com",
			matchedPath: null,
			params: {},
			path: "/path",
			query: { query: "1" },
			bodyReader,
			test: "value",
			bodyResult: undefined,
			filesAttache: undefined,
		});
	});

	it("multi instance", () => {
		class CloneRequest extends kindHeritage(
			"request",
			createCoreLibKind("request"),
		) {}

		expect((new CloneRequest()) instanceof Request).toBe(true);
		expect((new Request({} as any)) instanceof CloneRequest).toBe(true);
	});

	it("getBody", async() => {
		const spy = vi.fn(() => "superBody");
		const bodyRequest = new Request({
			method: "GET",
			headers: { host: "example.com" },
			url: "https://example.com/path?query=1",
			host: "example.com",
			origin: "https://example.com",
			matchedPath: null,
			params: {},
			path: "/path",
			query: { query: "1" },
			bodyReader: createBodyReader(spy),
		});

		const body = bodyRequest.getBody();
		void bodyRequest.getBody();
		void bodyRequest.getBody();
		await expect(bodyRequest.getBody()).resolves.toStrictEqual(E.success("superBody"));
		await expect(body).resolves.toStrictEqual(E.success("superBody"));
		expect(bodyRequest.getBody()).toStrictEqual(E.success("superBody"));
		expect(spy).toHaveBeenCalledTimes(1);
	});
});
