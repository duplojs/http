import { ResponseContract, useRouteBuilder } from "@duplojs/http";
import { DPE } from "@duplojs/utils";
import { userExist } from "./checker";
import { userSchema } from "./schema";

useRouteBuilder("GET", "/users/{userId}")
	.extract({
		params: {
			userId: DPE.coerce.number(),
		},
	})
	.check(
		userExist,
		{
			input: ({ userId }) => userId,
			result: "user.find",
			otherwise: ResponseContract.notFound("user.notfound"),
			indexing: "user",
		},
	)
	.handler(
		ResponseContract.ok("user.find", userSchema),
		({ user }, { response }) => response("user.find", user),
	);
