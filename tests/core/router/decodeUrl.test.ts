import { decodeUrl } from "@core/router";

describe("decodeUrl", () => {
	it("decodes paths and query parameters", () => {
		const result = decodeUrl("/users/%20list?name=John%20Doe&age=30");

		expect(result).toStrictEqual({
			path: "/users/ list",
			query: {
				name: "John Doe",
				age: "30",
			},
		});
	});

	it("decodes paths without query parameters", () => {
		const result = decodeUrl("/users%2f/%20list");

		expect(result).toStrictEqual({
			path: "/users// list",
			query: {},
		});
	});

	it("decodes paths with empty path", () => {
		const result = decodeUrl("");

		expect(result).toStrictEqual({
			path: "/",
			query: {},
		});
	});

	it("aggregates duplicated query keys into arrays", () => {
		const result = decodeUrl("/search?tag=node&tag=typescript&tag=vitest");

		expect(result).toStrictEqual({
			path: "/search",
			query: {
				tag: ["node", "typescript", "vitest"],
			},
		});
	});

	it("returns null when decoding fails", () => {
		const result = decodeUrl("/%E0%A4%A?value=%E0%A4");

		expect(result).toBeNull();
	});

	it("can be called multiple times without leaking state", () => {
		const firstResult = decodeUrl("/first?value=1");
		const secondResult = decodeUrl("/second?value=2");

		expect(firstResult).toStrictEqual({
			path: "/first",
			query: { value: "1" },
		});
		expect(secondResult).toStrictEqual({
			path: "/second",
			query: { value: "2" },
		});
	});

	it("prototype pollution", () => {
		const firstResult = decodeUrl("/first?__proto__=1&constructor=5&prototype=rerer");

		expect(firstResult).toStrictEqual({
			path: "/first",
			query: {},
		});
	});
});
