import { createCoreLibKind, Response, StreamTextPredictedResponse } from "@core";
import { kindHeritage } from "@duplojs/utils";

describe("text stream predicted response", () => {
	it("construct", () => {
		const startStream = () => undefined;

		expect(
			{ ...new StreamTextPredictedResponse("200", "OK", startStream) },
		).toStrictEqual({
			"@duplojs/utils/kind/@DuplojsHttpCore/stream-text-predicted-response": null,
			"@duplojs/utils/kind/@DuplojsHttpCore/response": null,
			code: "200",
			information: "OK",
			body: undefined,
			headers: undefined,
			startStream,
		});
	});

	it("multi instance", () => {
		class CloneStreamTextPredictedResponse extends kindHeritage(
			"stream-text-predicted-response",
			createCoreLibKind("stream-text-predicted-response"),
			Response,
		) {}

		expect((
			new CloneStreamTextPredictedResponse({}, [undefined, undefined, undefined])
		) instanceof StreamTextPredictedResponse).toBe(true);
		expect((new StreamTextPredictedResponse("200", "OK", () => undefined)) instanceof CloneStreamTextPredictedResponse).toBe(true);
	});
});
