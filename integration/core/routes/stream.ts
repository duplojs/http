import { ResponseContract, useRouteBuilder } from "@duplojs/http";
import { DPE, sleep } from "@duplojs/utils";

useRouteBuilder("GET", "/stream")
	.extract({
		query: {
			value: DPE.coerce.number(),
		},
	})
	.handler(
		ResponseContract.stream("monSuperStream", DPE.number()),
		({ value }, { streamResponse }) => streamResponse(
			"monSuperStream",
			async({ send }) => {
				await send(1);

				await sleep(200);

				await send(2);

				await sleep(200);

				await send(3);

				await sleep(200);

				await send(4);

				await sleep(200);

				await send(5);

				await sleep(200);

				await send(value);
			},
		),
	);
