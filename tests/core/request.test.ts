import { createCoreLibKind, Request } from "@core";
import { kindHeritage } from "@duplojs/utils";

describe("Request", () => {
	it("construct", () => {
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
				...({
					test: "value",
				}),
			}),
		}).toStrictEqual({
			"@duplojs/utils/kind/@DuplojsHttpCore/request": null,
			method: "GET",
			body: undefined,
			headers: { host: "example.com" },
			url: "https://example.com/path?query=1",
			host: "example.com",
			origin: "https://example.com",
			matchedPath: null,
			params: {},
			path: "/path",
			query: { query: "1" },
			test: "value",
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
});
