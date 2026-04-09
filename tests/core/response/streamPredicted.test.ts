import { createCoreLibKind, Response, StreamPredictedResponse } from "@core";
import { kindHeritage } from "@duplojs/utils";

describe("stream predicted response", () => {
	it("construct", () => {
		const startStream = () => undefined;

		expect(
			{ ...new StreamPredictedResponse("200", "OK", startStream) },
		).toStrictEqual({
			"@duplojs/utils/kind/@DuplojsHttpCore/stream-predicted-response": null,
			"@duplojs/utils/kind/@DuplojsHttpCore/response": null,
			code: "200",
			information: "OK",
			body: undefined,
			headers: undefined,
			startStream,
		});
	});

	it("multi instance", () => {
		class CloneStreamPredictedResponse extends kindHeritage(
			"stream-predicted-response",
			createCoreLibKind("stream-predicted-response"),
			Response,
		) {}

		expect((
			new CloneStreamPredictedResponse({}, [undefined, undefined, undefined])
		) instanceof StreamPredictedResponse).toBe(true);
		expect((new StreamPredictedResponse("200", "OK", () => undefined)) instanceof CloneStreamPredictedResponse).toBe(true);
	});
});
