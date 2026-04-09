import { ResponseContract, useRouteBuilder } from "@duplojs/http";
import { DPE, sleep } from "@duplojs/utils";

useRouteBuilder("GET", "/binary-stream")
	.handler(
		ResponseContract.stream(
			"binary-stream",
			DPE.number(),
		),
		(__, { streamResponse }) => streamResponse(
			"binary-stream",
			async({ send }) => {
				await send(12);
				await sleep(500);
				await send(20);
			},
		),
	);

useRouteBuilder("POST", "/text-stream")
	.extract({
		body: {
			value: DPE.string(),
		},
	})
	.handler(
		ResponseContract.streamText("text-stream"),
		({ value }, { streamTextResponse }) => streamTextResponse(
			"text-stream",
			async({ send }) => {
				await send("hello");
				await sleep(500);
				await send(` ${value}`);
			},
		),
	);
