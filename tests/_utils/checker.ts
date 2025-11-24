import { createChecker, useCheckerBuilder } from "@core";
import { forward } from "@duplojs/utils";

export const testChecker = createChecker({
	theFunction: (input: string, params) => input ? params.output("info", 42) : params.output("info2", "ok"),
	options: { foo: "bar" },
});

export const testCheckerWithOptions = useCheckerBuilder({
	options: forward<{
		prop1: string;
		prop2?: number;
	}>({
		prop1: "toto",
	}),
})
	.handler(
		(input: string, { output, options }) => input
			? output("result.input", input)
			: output("result.options", options),
	);
