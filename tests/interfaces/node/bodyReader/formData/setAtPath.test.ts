import { setAtPath } from "@interface-node";

describe("setAtPath", () => {
	it("builds nested objects and arrays from complex path", () => {
		const result = {};

		setAtPath(result, "test/\\/\\ok/\\/\\[0]/\\/\\/\\/\\prop", 1, 2500);
		setAtPath(result, "test/\\/\\ok/\\/\\[0]/\\/\\/\\/\\toto", "superValue", 2500);
		setAtPath(result, "test/\\/\\ok/\\/\\[0]/\\/\\/\\/\\sub/\\/\\[0]", "ok", 2500);
		setAtPath(result, "test/\\/\\ok/\\/\\[1]", 2, 2500);
		setAtPath(result, "test/\\/\\", "val", 2500);

		expect(result).toStrictEqual({
			test: {
				ok: [
					{
						"": {
							prop: 1,
							toto: "superValue",
							sub: ["ok"],
						},
					},
					2,
				],
				"": "val",
			},
		});
	});

	it("creates an array when path starts with index", () => {
		const result = setAtPath(undefined, "[0]/\\/\\prop", 42, 2500) as any[];

		expect(Array.isArray(result)).toBe(true);
		expect(result[0]).toStrictEqual({ prop: 42 });
	});

	it("creates an object when path starts with key", () => {
		const result = setAtPath(undefined, "root/\\/\\[0]", "ok", 2500) as any;

		expect(result).toStrictEqual({ root: ["ok"] });
	});

	it("sets value when path has a single element", () => {
		const result = setAtPath({}, "simple", "value", 2500) as any;

		expect(result).toStrictEqual({ simple: "value" });
	});

	it("ignores index bigger than limit", () => {
		const result = setAtPath({}, "[2501]/\\/\\prop", "nope", 2500) as any;

		expect(result).toStrictEqual({});
	});

	it("blocks __proto__ path to prevent prototype pollution", () => {
		const target = {};
		setAtPath(target, "__proto__/\\/\\polluted", true, 2500);

		expect(({} as any).polluted).toBeUndefined();
		expect(target).toStrictEqual({});
	});

	it("blocks constructor path to prevent prototype pollution", () => {
		const target = {};
		setAtPath(target, "constructor/\\/\\prototype/\\/\\polluted", true, 2500);

		expect(({} as any).polluted).toBeUndefined();
		expect(target).toStrictEqual({});
	});

	it("blocks prototype path to prevent prototype pollution", () => {
		const target = {};
		setAtPath(target, "prototype/\\/\\polluted", true, 2500);

		expect(({} as any).polluted).toBeUndefined();
		expect(target).toStrictEqual({});
	});

	it("ignores dangerous segment nested in path", () => {
		const target = {};
		setAtPath(target, "safe/\\/\\__proto__/\\/\\polluted", true, 2500);

		expect(({} as any).polluted).toBeUndefined();
		expect(target).toStrictEqual({ safe: undefined });
	});
});
