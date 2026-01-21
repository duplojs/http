import { createCutStep, cutStepKind, stepKind, type CutStepDefinition, ResponseContract } from "@core";
import { DP } from "@duplojs/utils";

describe("cutStep", () => {
	it("createCutStep", () => {
		const definition: CutStepDefinition = {
			theFunction: (_floor, params) => params.output({ foo: "bar" }),
			responseContract: ResponseContract.ok("cut ok", DP.empty()),
			metadata: [],
		};

		expect(createCutStep(definition)).toStrictEqual({
			[cutStepKind.runTimeKey]: null,
			[stepKind.runTimeKey]: null,
			definition,
		});
	});
});
