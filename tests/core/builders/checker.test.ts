import { type Checker, type CheckerFunctionOutput, type CheckerFunctionParams, checkerKind, useCheckerBuilder } from "@core";
import { type ExpectType } from "@duplojs/utils";

describe("build checker", () => {
	it("create checker", () => {
		const checker = useCheckerBuilder()
			.handler(
				(input: string, { output, options }) => {
					type Check = ExpectType<
						typeof options,
						undefined,
						"strict"
					>;

					return input.valueOf() ? output("info", 123) : output("error", "fail");
				},
			);

		expect(
			checker,
		).toStrictEqual({
			[checkerKind.runTimeKey]: null,
			definition: {
				theFunction: expect.any(Function),
				options: undefined,
			},
		});

		type Check = ExpectType<
			typeof checker,
			Checker<{
				theFunction(
					input: string,
					params: CheckerFunctionParams<undefined>
				): CheckerFunctionOutput<"info", number> | CheckerFunctionOutput<"error", string>;
				options: undefined;
			}>,
			"strict"
		>;
	});

	it("create checker with options", () => {
		const checker = useCheckerBuilder({ options: { flag: true } })
			.handler(
				(input: string, { output, options }) => {
					type Check = ExpectType<
						typeof options,
						{ flag: boolean },
						"strict"
					>;

					return input.valueOf() ? output("info", 123) : output("error", "fail");
				},
			);

		expect(
			checker,
		).toStrictEqual({
			[checkerKind.runTimeKey]: null,
			definition: {
				theFunction: expect.any(Function),
				options: {
					flag: true,
				},
			},
		});

		type Check = ExpectType<
			typeof checker,
			Checker<{
				theFunction(
					input: string,
					params: CheckerFunctionParams<{ flag: boolean }>
				): CheckerFunctionOutput<"info", number> | CheckerFunctionOutput<"error", string>;
				options: { flag: boolean };
			}>,
			"strict"
		>;
	});
});
