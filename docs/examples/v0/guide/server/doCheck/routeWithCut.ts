import { ResponseContract, useRouteBuilder } from "@duplojs/http";
import { DPE } from "@duplojs/utils";
import { userSchema } from "./schema";
import { findOneUser } from "./findOneUser";

useRouteBuilder("GET", "/users/{userId}")
	.extract({
		params: {
			userId: DPE.coerce.number(),
		},
	})
	.cut(
		[
			ResponseContract.notFound("user.notfound"),
			ResponseContract.forbidden("user.inaccessible"),
		],
		async({ userId }, { response, output }) => {
			if (userId === 0) {
				return response("user.inaccessible");
			}

			const user = await findOneUser(userId);

			if (!user) {
				return response("user.notfound");
			}

			return output({ user });
		},
	)
	.handler(
		ResponseContract.ok("user.find", userSchema),
		({ user }, { response }) => response("user.find", user),
	);
