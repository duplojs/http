import { checkerStepKind, createCheckerStep, stepKind } from "@core";
import { testChecker } from "@test-utils/checker";

describe("checkerStep", () => {
	it("createCheckerStep", () => {
		expect(
			createCheckerStep({
				checker: testChecker,
				result: "result",
				input: () => ({}),
				responseContract: {} as any,
				metadata: [],
			}),
		).toStrictEqual({
			[checkerStepKind.runTimeKey]: null,
			[stepKind.runTimeKey]: null,
			definition: {
				checker: testChecker,
				result: "result",
				input: expect.any(Function),
				responseContract: {} as any,
				metadata: [],
			},
		});
	});
});
