import { type PreflightBuilder, usePreflightBuilder, type Request, type HookParamsOnConstructRequest, IgnoreByRouteStoreMetadata, type Metadata } from "@core";
import { builderKind, type ExpectType } from "@duplojs/utils";

describe("preflight builder", () => {
	it("usePreflightBuilder", () => {
		const preflightBuilder = usePreflightBuilder();

		expect({ ...preflightBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					preflightSteps: [],
					metadata: [],
				},
			}),
		);

		type Check = ExpectType<
			typeof preflightBuilder,
			PreflightBuilder<
				{
					readonly preflightSteps: readonly [];
					readonly hooks: readonly [];
					readonly metadata: readonly [];
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
					metadata: [],
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
					readonly metadata: readonly [];
				},
				{},
				& Request
				& { aa: number }
				& { bb: number }
			>,
			"strict"
		>;
	});

	it("usePreflightBuilder with metadata", () => {
		const preflightBuilder = usePreflightBuilder({
			metadata: [IgnoreByRouteStoreMetadata()],
		});

		expect({ ...preflightBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					preflightSteps: [],
					metadata: [IgnoreByRouteStoreMetadata()],
				},
			}),
		);

		type Check = ExpectType<
			typeof preflightBuilder,
			PreflightBuilder<
				{
					readonly preflightSteps: readonly [];
					readonly hooks: readonly [];
					readonly metadata: readonly [Metadata<"ignore-by-route-store", unknown>];
				},
				{},
				Request
			>,
			"strict"
		>;
	});
});
