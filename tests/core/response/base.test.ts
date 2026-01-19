import { createCoreLibKind, Response } from "@core";
import { kindHeritage } from "@duplojs/utils";

describe("response", () => {
	it("construct", () => {
		expect({
			...new Response(
				"100",
				"My Information",
				{ my: "body" },
			),
		}).toStrictEqual({
			"@duplojs/utils/kind/@DuplojsHttpCore/response": null,
			code: "100",
			information: "My Information",
			body: { my: "body" },
			headers: undefined,
		});
	});

	it("multi instance", () => {
		class CloneResponse extends kindHeritage(
			"response",
			createCoreLibKind("response"),
			Response,
		) {}

		expect((new CloneResponse({}, [undefined, undefined, undefined])) instanceof Response).toBe(true);
		expect((new Response("200", "OK", null)) instanceof CloneResponse).toBe(true);
	});

	it("setHeader", () => {
		expect(
			new Response("200", "test", undefined)
				.setHeader("test", "ok")
				.setHeader("test", "oo")
				.setHeader("test", undefined)
				.headers,
		).toStrictEqual({
			test: "oo",
		});
	});

	it("setHeaders", () => {
		expect(
			new Response("200", "test", undefined)
				.setHeaders({ test: "oo" })
				.setHeaders({ test: undefined })
				.headers,
		).toStrictEqual({
			test: "oo",
		});
	});

	it("deleteHeader with headers", () => {
		expect(
			new Response("200", "test", undefined)
				.setHeader("keep", "ok")
				.setHeader("remove", "oo")
				.deleteHeader("remove")
				.headers,
		).toStrictEqual({
			keep: "ok",
		});
	});

	it("deleteHeader without headers", () => {
		expect(
			new Response("200", "test", undefined)
				.deleteHeader("remove")
				.headers,
		).toBeUndefined();
	});
});
