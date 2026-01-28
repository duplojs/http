import { ResponseContract, useRouteBuilder } from "@duplojs/http";
import { DPE } from "@duplojs/utils";

useRouteBuilder("GET", "/hello-world")
	.extract({
		query: {
			name: DPE.string(),
		},
	})
	.handler(
		ResponseContract.ok("helloWorld.send", DPE.string()),
		(floor, { response }) => {
		// ^?





			const message = `hello ${floor.name}!`;

			return response("helloWorld.send", message);
		},
	);
