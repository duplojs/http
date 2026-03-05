import { ResponseContract, useRouteBuilder } from "@duplojs/http";
import { DPE, sleep } from "@duplojs/utils";

useRouteBuilder("GET", "/sse")
	.handler(
		ResponseContract.serverSentEvents("super-sse", DPE.object({ test: DPE.string() }), { other: DPE.string() }),
		(__, { serverSentEventsResponse }) => serverSentEventsResponse(
			"super-sse",
			async({ send }) => {
				send("message", { test: "1" });

				await sleep(500);

				send("message", { test: "2" }, { id: "test" });

				await sleep(500);

				send("other", "3");
			},
		),
	);
