import { createExtractStep, extractStepKind, stepKind, type ExtractStepDefinition, ResponseContract } from "@core";
import { DP } from "@duplojs/utils";

describe("extractStep", () => {
	it("createExtractStep", () => {
		const definition: ExtractStepDefinition = {
			shape: {
				body: DP.string(),
				headers: {
					authorization: DP.string(),
				},
			},
			responseContract: ResponseContract.unprocessableContent("invalid extract input"),
		};

		expect(createExtractStep(definition)).toStrictEqual({
			[extractStepKind.runTimeKey]: null,
			[stepKind.runTimeKey]: null,
			definition,
		});
	});
});
