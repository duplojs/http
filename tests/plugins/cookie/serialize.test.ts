import { D } from "@duplojs/utils";
import { defaultSerializer, SerializeCookieError } from "@plugin-cookie";

describe("defaultSerializer", () => {
	it("serializes cookies with encoded values and attributes", () => {
		const result = defaultSerializer(
			"session_id",
			"hello world",
			{
				maxAge: 0,
				path: "/app",
				sameSite: "lax",
				httpOnly: true,
			},
		);

		expect(result).toBe(
			"session_id=hello%20world; Max-Age=0; Path=/app; HttpOnly; SameSite=Lax",
		);
	});

	it("serializes domain, security and optional policy attributes", () => {
		const result = defaultSerializer(
			"session",
			"value",
			{
				domain: ".example.com",
				secure: true,
				partitioned: true,
				priority: "high",
				sameSite: "strict",
			},
		);

		expect(result).toBe(
			"session=value; Domain=.example.com; Secure; Partitioned; Priority=High; SameSite=Strict",
		);
	});

	it("serializes low and medium priorities and SameSite=None", () => {
		expect(
			defaultSerializer("low", "value", { priority: "low" }),
		).toBe("low=value; Priority=Low");
		expect(
			defaultSerializer("medium", "value", {
				priority: "medium",
				sameSite: "none",
			}),
		).toBe("medium=value; Priority=Medium; SameSite=None");
	});

	it("serializes expires with the HTTP-date format", () => {
		const result = defaultSerializer(
			"token",
			"value",
			{
				expires: D.createOrThrow("date1704164645000+"),
			},
		);

		expect(result).toBe(
			"token=value; Expires=Tue, 02 Jan 2024 03:04:05 GMT",
		);
	});

	it("serializes expireIn from a D.TheTime value", () => {
		vi.useFakeTimers();

		try {
			vi.setSystemTime(new Date("2024-01-02T03:04:05.000Z"));

			const result = defaultSerializer(
				"token",
				"value",
				{
					expireIn: D.createTime(1, "hour"),
				},
			);

			expect(result).toBe(
				"token=value; Expires=Tue, 02 Jan 2024 04:04:05 GMT",
			);
		} finally {
			vi.useRealTimers();
		}
	});

	it("rejects invalid cookie names", () => {
		expect(() => defaultSerializer("session:id", "value"))
			.toThrowError(SerializeCookieError);
	});

	it("rejects values that cannot be percent-encoded", () => {
		expect(() => defaultSerializer("token", "\uD800"))
			.toThrow();
	});

	it("rejects invalid numeric and path-like attributes", () => {
		expect(
			() => defaultSerializer("token", "value", { maxAge: 12.5 }),
		).toThrowError(/param maxAge is invalid/);
		expect(
			() => defaultSerializer("token", "value", { path: "/bad;path" }),
		).toThrowError(/param path is invalid/);
	});

	it("rejects invalid domain and expires attributes", () => {
		expect(
			() => defaultSerializer("token", "value", { domain: "bad_domain" }),
		).toThrowError(/param domain is invalid/);
		expect(
			() => defaultSerializer("token", "value", { expires: new Date(Number.NaN) as never }),
		).toThrowError(/param expires is invalid/);
	});

	it("rejects expireIn when it is not a D.TheTime", () => {
		expect(
			() => defaultSerializer(
				"token",
				"value",
				{ expireIn: 1000 as never },
			),
		).toThrowError(/param expireIn is invalid/);
	});

	it("rejects expires and expireIn together", () => {
		expect(
			() => defaultSerializer(
				"token",
				"value",
				{
					expires: D.create("2024-01-02"),
					expireIn: D.createTime(1, "hour"),
				} as never,
			),
		).toThrowError(/params expires and expireIn are mutually exclusive/);
	});
});
