import { ResponseContract, useRouteBuilder } from "@duplojs/http";
import { DPE, sleep } from "@duplojs/utils";

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
