import { createNarrowingInput } from "@core";

describe("createNarrowingInput", () => {
	it("returns functions that wrap input name and value", () => {
		const narrowing = createNarrowingInput<{
			foo: string;
			count: number;
		}>();

		expect(narrowing.foo("bar")).toStrictEqual({
			inputName: "foo",
			value: "bar",
		});
		expect(narrowing.count(2)).toStrictEqual({
			inputName: "count",
			value: 2,
		});
	});

	it("caches getters per property", () => {
		const narrowing = createNarrowingInput<Record<string, unknown>>();

		const first = narrowing.test;
		const second = narrowing.test;
		const other = narrowing.other;

		expect(first).toBe(second);
		expect(first).not.toBe(other);
	});
});
