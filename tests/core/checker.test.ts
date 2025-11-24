import { checkerKind, createChecker } from "@core";

describe("checker", () => {
	it("createChecker", () => {
		expect(
			createChecker({
				theFunction: (input, params) => params.output("info", 42),
				options: { foo: "bar" },
			}),
		).toStrictEqual({
			definition: {
				theFunction: expect.any(Function),
				options: { foo: "bar" },
			},
			[checkerKind.runTimeKey]: null,
		});
	});
});
