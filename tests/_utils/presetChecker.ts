import { createPresetChecker, ResponseContract } from "@core";
import { testChecker } from "./checker";

export const testPresetChecker = createPresetChecker(
	testChecker,
	{
		result: "info",
		otherwise: ResponseContract.notFound("notFound"),
	},
);
