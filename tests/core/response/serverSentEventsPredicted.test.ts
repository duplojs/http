import { createCoreLibKind, Response, ServerSentEventsPredictedResponse } from "@core";
import { kindHeritage } from "@duplojs/utils";

describe("server sent events predicted response", () => {
	it("construct", () => {
		const startSendingEvents = () => undefined;

		expect(
			{ ...new ServerSentEventsPredictedResponse("200", "OK", startSendingEvents) },
		).toStrictEqual({
			"@duplojs/utils/kind/@DuplojsHttpCore/server-sent-events-predicted-response": null,
			"@duplojs/utils/kind/@DuplojsHttpCore/response": null,
			code: "200",
			information: "OK",
			body: undefined,
			headers: undefined,
			startSendingEvents,
		});
	});

	it("multi instance", () => {
		class CloneServerSentEventsPredictedResponse extends kindHeritage(
			"server-sent-events-predicted-response",
			createCoreLibKind("server-sent-events-predicted-response"),
			Response,
		) {}

		expect((
			new CloneServerSentEventsPredictedResponse({}, [undefined, undefined, undefined])
		) instanceof ServerSentEventsPredictedResponse).toBe(true);
		expect((new ServerSentEventsPredictedResponse("200", "OK", () => undefined)) instanceof CloneServerSentEventsPredictedResponse).toBe(true);
	});
});
