import {
	decode,
	defaultParser,
	findPairEndIndex,
	sliceAndTrimOws,
} from "@plugin-cookie/parser";

describe("cookie parser utils", () => {
	it("findPairEndIndex returns the next separator or the string length", () => {
		expect(findPairEndIndex("foo=bar; test=value", 0, 19)).toBe(7);
		expect(findPairEndIndex("foo=bar", 0, 7)).toBe(7);
	});

	it("sliceAndTrimOws trims spaces and tabs around the selected slice", () => {
		expect(sliceAndTrimOws(" \t foo \t ", 0, 9)).toBe("foo");
		expect(sliceAndTrimOws("foo bar", 0, 7)).toBe("foo bar");
		expect(sliceAndTrimOws("value", 2, 2)).toBe("");
	});

	it("decode keeps raw values without percent encoding and falls back on malformed input", () => {
		expect(decode("plain-value")).toBe("plain-value");
		expect(decode("hello%20world")).toBe("hello world");
		expect(decode("%E0%A4%A")).toBe("%E0%A4%A");
	});
});

describe("defaultParser", () => {
	it("returns an object without prototype for short or empty values", () => {
		const result = defaultParser("");

		expect(result).toStrictEqual({});
		expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
	});

	it("returns an empty result when no cookie pair can be found", () => {
		expect(defaultParser("foo; bar")).toStrictEqual({});
	});

	it("parses cookie pairs, trims OWS and decodes values", () => {
		expect(
			defaultParser(" foo = bar ; test = hello%20world "),
		).toStrictEqual(
			{
				foo: "bar",
				test: "hello world",
			},
		);
	});

	it("keeps the first value when a cookie name appears multiple times", () => {
		expect(
			defaultParser("token=first; token=second"),
		).toStrictEqual(
			{
				token: "first",
			},
		);
	});

	it("ignores empty names and recovers after invalid segments", () => {
		expect(
			defaultParser("=skip; broken; valid=value"),
		).toStrictEqual(
			{
				valid: "value",
			},
		);
	});

	it("ignores forbidden keys like __proto__, constructor and prototype", () => {
		const result = defaultParser("__proto__=value; constructor=test; prototype=skip; ok=1");

		expect(result).toStrictEqual({ ok: "1" });
		expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
	});
});
