import { ResponseContract, useRouteBuilder } from "@duplojs/http";
import { DPE } from "@duplojs/utils";
import { userSchema } from "./schema";
import { iWantUserExist } from "./presetChecker";

useRouteBuilder("GET", "/users/{userId}")
	.extract({
		params: {
			userId: DPE.coerce.number(),
		},
	})
	.presetCheck(
		iWantUserExist.indexing("user"),
		({ userId }) => userId,
	)
	.handler(
		ResponseContract.ok("user.find", userSchema),
		({ user }, { response }) => response("user.find", user),
	);
