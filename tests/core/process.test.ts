import { createProcess, processKind } from "@core";

describe("process", () => {
	it("createProcess", () => {
		expect(
			createProcess({
				steps: [],
				hooks: [],
				options: {},
			}),
		).toStrictEqual({
			definition: {
				steps: [],
				hooks: [],
				options: {},
			},
			[processKind.runTimeKey]: null,
		});
	});
});
