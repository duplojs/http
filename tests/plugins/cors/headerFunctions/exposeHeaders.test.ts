import { Response } from "@core/response";
import { exposeHeadersFunction } from "@plugin-cors/headerFunctions";

describe("exposeHeadersFunction", () => {
	it("set expose headers header", () => {
		const response = new Response("204", "cors", undefined);

		exposeHeadersFunction.default("Authorization,ETag")(undefined as never, response);

		expect(response.headers!["Access-Control-Expose-Headers"]).toStrictEqual("Authorization,ETag");
	});
});
