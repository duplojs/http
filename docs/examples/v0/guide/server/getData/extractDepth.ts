import { useRouteBuilder } from "@duplojs/http";
import { DPE } from "@duplojs/utils";

useRouteBuilder("POST", "/users/{userId}")
	.extract({
		headers: {
			token: DPE.string(),
		},
		body: DPE.object({
			username: DPE.string(),
			age: DPE.string(),
		}),
	});
