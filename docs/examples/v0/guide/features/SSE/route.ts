import { ResponseContract, useRouteBuilder } from "@duplojs/http";
import { D, DPE, sleep } from "@duplojs/utils";

useRouteBuilder("GET", "/some-route")
	.extract({
		headers: {
			superToken: DPE.string(),
		},
	})
	.cut(
		ResponseContract.unauthorized("invalid-token"),
		({ superToken }, { response, output }) => {
			if (superToken !== "valid-token") {
				return response("invalid-token");
			}

			return output();
		},
	)
	.handler(
		ResponseContract.serverSentEvents(
			"SSE",
			DPE.object({ value: DPE.string() }),
			{ otherEvent: DPE.string() },
		),
		(__, { serverSentEventsResponse }) => serverSentEventsResponse(
			"SSE",
			async({ send, lastId, isAbort }) => {
				if (lastId !== null) {
					await send(
						"otherEvent",
						"successful reconnection",
						{ retry: "10s" },
					);
				}

				while (isAbort() === false) {
					await send(
						"message",
						{ value: "super Value" },
						{ id: D.now().toString() },
					);

					await sleep(1000);
				}
			},
		),
	);
