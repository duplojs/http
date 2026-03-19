import { Response } from "@core/response";
import { credentialsFunction } from "@plugin-cors/headerFunctions";

describe("credentialsFunction", () => {
	it("set allow credentials header", () => {
		const response = new Response("204", "cors", undefined);

		credentialsFunction.default()(undefined as never, response);

		expect(response.headers!["access-control-allow-credentials"]).toStrictEqual("true");
	});
});
