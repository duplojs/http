import { createCoreLibKind, PredictedResponse, Response } from "@core";
import { kindHeritage } from "@duplojs/utils";

describe("hook response", () => {
	it("construct", () => {
		expect(
			{ ...new PredictedResponse("200", "OK", { message: "success" }) },
		).toStrictEqual({
			"@duplojs/utils/kind/@DuplojsHttpCore/predicted-response": null,
			"@duplojs/utils/kind/@DuplojsHttpCore/response": null,
			code: "200",
			information: "OK",
			body: { message: "success" },
			headers: undefined,
		});
	});

	it("multi instance", () => {
		class CloneHookResponse extends kindHeritage(
			"predicted-response",
			createCoreLibKind("predicted-response"),
			Response,
		) {}

		expect((new CloneHookResponse({}, [undefined, undefined, undefined])) instanceof PredictedResponse).toBe(true);
		expect((new PredictedResponse("200", "OK", null)) instanceof CloneHookResponse).toBe(true);
	});
});
