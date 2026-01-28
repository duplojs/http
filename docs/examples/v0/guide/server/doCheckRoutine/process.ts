import { ResponseContract, useProcessBuilder } from "@duplojs/http";
import { DPE, E, O, pipe } from "@duplojs/utils";
import { checkToken } from "./checkToken";
import { userExist } from "./checker";

export const authenticationProcess = useProcessBuilder()
	.extract({
		headers: {
			authorization: DPE.string(),
		},
	})
	.cut(
		ResponseContract.unauthorized("token.invalid"),
		({ authorization }, { response, output }) => pipe(
			authorization,
			checkToken,
			E.whenIsRight(
				({ userId }) => output({ authenticatedUserId: userId }),
			),
			E.whenIsLeft(() => response("token.invalid")),
		),
	)
	.check(
		userExist,
		{
			input: O.getProperty("authenticatedUserId"),
			result: "user.find",
			otherwise: ResponseContract.notFound("token.user.notfound"),
			indexing: "user",
		},
	)
	.exports(["user"]);
