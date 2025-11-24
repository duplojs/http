import { type PreflightBuilder, usePreflightBuilder, type Request, type HookParamsOnConstructRequest } from "@core";
import { builderKind, type ExpectType } from "@duplojs/utils";

describe("preflight builder", () => {
	it("usePreflightBuilder", () => {
		const preflightBuilder = usePreflightBuilder();

		expect({ ...preflightBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					preflightSteps: [],
				},
			}),
		);

		type Check = ExpectType<
			typeof preflightBuilder,
			PreflightBuilder<
				{
					readonly preflightSteps: readonly [];
					readonly hooks: readonly [];
				},
				{},
				Request
			>,
			"strict"
		>;
	});

	it("usePreflightBuilder with hook", () => {
		const preflightBuilder = usePreflightBuilder({
			hooks: [
				{ onConstructRequest: ({ addRequestProperties }) => addRequestProperties({ aa: 1 }) },
				{ onConstructRequest: ({ addRequestProperties }) => addRequestProperties({ bb: 1 }) },
			],
		});

		expect({ ...preflightBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [
						{ onConstructRequest: expect.any(Function) },
						{ onConstructRequest: expect.any(Function) },
					],
					preflightSteps: [],
				},
			}),
		);

		type Check = ExpectType<
			typeof preflightBuilder,
			PreflightBuilder<
				{
					readonly preflightSteps: readonly [];
					readonly hooks: readonly [
						{
							// eslint-disable-next-line @typescript-eslint/method-signature-style
							readonly onConstructRequest: (params: HookParamsOnConstructRequest) => Request & {
								aa: number;
							};
						},
						{
							// eslint-disable-next-line @typescript-eslint/method-signature-style
							readonly onConstructRequest: (params: HookParamsOnConstructRequest) => Request & {
								bb: number;
							};
						},
					];
				},
				{},
				& Request
				& { aa: number }
				& { bb: number }
			>,
			"strict"
		>;
	});
});
