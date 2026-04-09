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

useRouteBuilder("POST", "/stream-text")
	.extract({
		body: {
			value: DPE.string(),
		},
	})
	.handler(
		ResponseContract.streamText("monSuperStream"),
		({ value }, { streamTextResponse }) => streamTextResponse(
			"monSuperStream",
			async({ send }) => {
				await send("super");

				await sleep(200);

				await send("Value");

				await sleep(200);

				await send("De");

				await sleep(200);

				await send("La");

				await sleep(200);

				await send("Mort");

				await sleep(200);

				await send(` ${value}`);
			},
		),
	);
