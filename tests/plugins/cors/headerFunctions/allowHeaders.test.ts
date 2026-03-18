import { Response } from "@core/response";
import { allowHeadersFunction } from "@plugin-cors/headerFunctions";

describe("allowHeadersFunction", () => {
	it("expect good", () => {
		const response = new Response("204", "cors", undefined);

		allowHeadersFunction.default("Authorization,ETag")(undefined as never, response);

		expect(response.headers!["Access-Control-Allow-Headers"]).toStrictEqual("Authorization,ETag");
	});
});
