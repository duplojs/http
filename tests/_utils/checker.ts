import { createChecker } from "@core";

export const testChecker = createChecker({
	theFunction: (input, params) => params.output("info", 42),
	options: { foo: "bar" },
});
