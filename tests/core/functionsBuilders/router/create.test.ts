import { createRouterFunctionBuilder } from "@core";

describe("createRouterFunctionBuilder", () => {
	it("correct help", () => {
		const theFunction = vi.fn();
		const result = createRouterFunctionBuilder(
			theFunction,
		);

		expect(result).toBe(theFunction);
	});
});
