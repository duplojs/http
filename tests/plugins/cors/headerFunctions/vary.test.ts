import { Response } from "@core/response";
import { varyFunction } from "@plugin-cors/headerFunctions";

describe("varyFunction", () => {
	it("basic usage", () => {
		const response = new Response("204", "cors", undefined);

		varyFunction.default()({ origin: "https://basic.example.com" } as never, response);

		expect(response.headers!.vary).toStrictEqual("Origin");
	});

	it("reuses cached vary", () => {
		const vary = varyFunction.default();
		const firstResponse = new Response("204", "cors", undefined)
			.setHeader("vary", "Accept-Encoding");
		const secondResponse = new Response("204", "cors", undefined)
			.setHeader("vary", "X-Test");

		vary({ origin: "https://cache.example.com" } as never, firstResponse);
		vary({ origin: "https://cache.example.com" } as never, secondResponse);

		expect(firstResponse.headers!.vary).toStrictEqual("Accept-Encoding, Origin");
		expect(secondResponse.headers!.vary).toStrictEqual("Accept-Encoding, Origin");
	});

	it("with array vary", () => {
		const response = new Response("204", "cors", undefined)
			.setHeader("vary", ["Accept-Encoding", "Accept-Language"]);

		varyFunction.default()({ origin: "https://array.example.com" } as never, response);

		expect(response.headers!.vary).toStrictEqual("Accept-Encoding, Accept-Language, Origin");
	});

	it("keeps star vary header", () => {
		const response = new Response("204", "cors", undefined)
			.setHeader("vary", "Accept-Encoding, *");

		varyFunction.default()({ origin: "https://star.example.com" } as never, response);

		expect(response.headers!.vary).toStrictEqual("*");
	});

	it("not duplicate", () => {
		const response = new Response("204", "cors", undefined)
			.setHeader("vary", "Accept-Encoding, Origin");

		varyFunction.default()({ origin: "https://origin.example.com" } as never, response);

		expect(response.headers!.vary).toStrictEqual("Accept-Encoding, Origin");
	});

	it("does not cache new origin when store is full", () => {
		const vary = varyFunction.default();

		for (let index = 0; index < 500; index++) {
			const response = new Response("204", "cors", undefined)
				.setHeader("vary", `X-Test-${index}`);

			vary({ origin: `https://filled-${index}.example.com` } as never, response);
		}

		const firstOverflowResponse = new Response("204", "cors", undefined)
			.setHeader("vary", "Accept-Encoding");
		const secondOverflowResponse = new Response("204", "cors", undefined)
			.setHeader("vary", "X-Second");

		vary({ origin: "https://overflow.example.com" } as never, firstOverflowResponse);
		vary({ origin: "https://overflow.example.com" } as never, secondOverflowResponse);

		expect(firstOverflowResponse.headers!.vary).toStrictEqual("Accept-Encoding, Origin");
		expect(secondOverflowResponse.headers!.vary).toStrictEqual("X-Second, Origin");
	});
});
