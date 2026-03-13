import { ResponseContract, useRouteBuilder } from "@duplojs/http";
import { DPE, sleep } from "@duplojs/utils";

useRouteBuilder("GET", "/sse")
	.extract({
		query: {
			close: DPE.coerce.boolean().optional().default(false),
		},
	})
	.handler(
		[
			ResponseContract.serverSentEvents("super-sse", DPE.object({ test: DPE.string() }), { other: DPE.string() }),
			ResponseContract.noContent("close"),
		],
		({ close }, { serverSentEventsResponse, response }) => {
			if (close) {
				return response("close");
			}
			return serverSentEventsResponse(
				"super-sse",
				async({ send }) => {
					await send("message", { test: "1" }, { retry: 100 });

					await sleep(200);

					await send("message", { test: "2" }, { id: "test" });

					await sleep(200);

					await send("other", "3");
				},
			);
		},
	);
