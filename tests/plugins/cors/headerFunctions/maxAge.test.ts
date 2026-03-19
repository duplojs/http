import { Response } from "@core/response";
import { maxAgeFunction } from "@plugin-cors/headerFunctions";

describe("maxAgeFunction", () => {
	it("set max age header", () => {
		const response = new Response("204", "cors", undefined);

		maxAgeFunction.default("600")(undefined as never, response);

		expect(response.headers!["access-control-max-age"]).toStrictEqual("600");
	});
});
