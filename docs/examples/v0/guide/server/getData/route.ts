import { ResponseContract, useRouteBuilder } from "@duplojs/http";
import { DPE } from "@duplojs/utils";

useRouteBuilder("POST", "/users/{userId}")
	.extract({
		params: {
			userId: DPE.coerce.number(),
		},
		query: {
			someValue: DPE.string().optional(),
			superQuery: DPE.coerce.number(),
		},
	})
	.extract({
		headers: {
			token: DPE.string(),
		},
		body: DPE.object({
			username: DPE.string(),
			age: DPE.string(),
		}),
	})
	.handler(
		ResponseContract.noContent("someInformation"),
		(floor, { response }) => {
			const {
				someValue,
				superQuery,
				token,
				userId,
				body: {
					username,
					age,
				},
			} = floor;

			return response("someInformation");
		},
	);
