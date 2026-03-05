import { queryToString } from "@client/queryToString";

describe("queryToString", () => {
	it("returns null when query is missing", () => {
		expect(queryToString(undefined)).toBeNull();
	});

	it("returns null when query has no usable values", () => {
		expect(queryToString({
			aa: undefined,
			bb: "",
		})).toBe("bb=");
	});

	it("serializes single values", () => {
		const result = queryToString({
			search: "duplo",
			page: "2",
		});

		expect(result).toBe("search=duplo&page=2");
	});

	it("serializes array values", () => {
		const result = queryToString({ tag: ["node", "typescript"] });

		expect(result).toBe("tag=node&tag=typescript");
	});

	it("skips falsy values inside query", () => {
		const result = queryToString({
			tag: ["node"],
			empty: "",
		});

		expect(result).toBe("tag=node&empty=");
	});
});
