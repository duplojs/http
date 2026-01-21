import { checkerStepKind, createPresetCheckerStep, presetCheckerStepKind, stepKind } from "@core";
import { testPresetChecker } from "@test-utils/presetChecker";

describe("presetCheckerStep", () => {
	it("createPresetCheckerStep", () => {
		expect(
			createPresetCheckerStep({
				presetChecker: testPresetChecker,
				input: () => "",
				metadata: [],
			}),
		).toStrictEqual({
			[presetCheckerStepKind.runTimeKey]: null,
			[stepKind.runTimeKey]: null,
			definition: {
				presetChecker: testPresetChecker,
				input: expect.any(Function),
				metadata: [],
			},
		});
	});
});
