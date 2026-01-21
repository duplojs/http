import { createProcess, processKind } from "@core";

describe("process", () => {
	it("createProcess", () => {
		expect(
			createProcess({
				steps: [],
				hooks: [],
				options: {},
				metadata: [],
			}),
		).toStrictEqual({
			definition: {
				steps: [],
				hooks: [],
				options: {},
				metadata: [],
			},
			[processKind.runTimeKey]: null,
		});
	});
});
