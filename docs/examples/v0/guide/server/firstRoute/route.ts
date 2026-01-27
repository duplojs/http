import { ResponseContract, useRouteBuilder } from "@duplojs/http";
import { DPE } from "@duplojs/utils";
import { userSchema } from "./schema";
import { getUsers } from "./getUsers";

useRouteBuilder("GET", "/users")
	.extract({
		query: {
			page: DPE.int().min(0),
			quantityPerPage: DPE.int().min(5).max(20),
		},
	})
	.handler(
		ResponseContract.ok("users.findMany", userSchema.array()),
		async({ page, quantityPerPage }, { response }) => {
			const manyUser = await getUsers({
				page,
				quantityPerPage,
			});

			return response("users.findMany", manyUser);
		},
	);
