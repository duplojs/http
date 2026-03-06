import { createCacheControlResponseHeader } from "@plugin-cacheController/hooks/createCacheController/createResponseHeader";

describe("createCacheControlResponseHeader", () => {
	it("serializes boolean and numeric directives", () => {
		const result = createCacheControlResponseHeader({
			maxAge: 120.9,
			sMaxAge: 30,
			public: true,
			noStore: true,
			mustRevalidate: true,
			staleWhileRevalidate: 15.8,
		});

		expect(result).toBe(
			"max-age=120,s-maxage=30,public,no-store,must-revalidate,stale-while-revalidate=15",
		);
	});

	it("serializes array directives", () => {
		const result = createCacheControlResponseHeader({
			private: ["authorization", "cookie"],
			noCache: ["set-cookie"],
			mustUnderstand: true,
		});

		expect(result).toBe(
			"private=\"authorization,cookie\",no-cache=\"set-cookie\",must-understand",
		);
	});

	it("ignores invalid, empty, or unsupported directive values", () => {
		const result = createCacheControlResponseHeader({
			maxAge: -1,
			sMaxAge: Number.POSITIVE_INFINITY,
			public: undefined,
			private: [],
			noCache: [],
			noTransform: false as never,
			staleIfError: Number.NaN,
			extensions: {},
		});

		expect(result).toBe("");
	});

	it("support extensions", () => {
		const result = createCacheControlResponseHeader({
			public: true,
			extensions: {
				foo: "bar",
				varyBy: "user",
			},
		});

		expect(result).toBe("public,foo=\"bar\",varyBy=\"user\"");
	});
});
