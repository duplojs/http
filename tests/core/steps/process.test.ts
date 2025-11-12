import { createProcessStep, processStepKind, stepKind, type Floor, type ProcessStepDefinition } from "@core";
import { testProcess } from "@test-utils/process";

describe("processStep", () => {
	it("createProcessStep", () => {
		const definition: ProcessStepDefinition = {
			process: testProcess,
			options: (floor: Floor) => ({ floor }),
			imports: ["shared"],
		};

		expect(createProcessStep(definition)).toStrictEqual({
			[processStepKind.runTimeKey]: null,
			[stepKind.runTimeKey]: null,
			definition,
		});
	});
});
