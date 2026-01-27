import { createPresetChecker, ResponseContract } from "@duplojs/http";
import { userExist } from "./checker";

export const iWantUserExist = createPresetChecker(
	userExist,
	{
		result: "user.find",
		otherwise: ResponseContract.notFound("user.notfound"),
	},
);
