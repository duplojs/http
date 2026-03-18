import { type PreflightBuilder, usePreflightBuilder, type Request, IgnoreByRouteStoreMetadata, type Metadata, type RouteHookParamsAfter, type RouteHookNext } from "@core";
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
				{}
			>,
			"strict"
		>;
	});

	it("usePreflightBuilder with hook", () => {
		const preflightBuilder = usePreflightBuilder({
			hooks: [
				{ afterSendResponse: ({ next }) => next() },
				{ afterSendResponse: ({ next }) => next() },
			],
		});

		expect({ ...preflightBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [
						{ afterSendResponse: expect.any(Function) },
						{ afterSendResponse: expect.any(Function) },
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
							readonly afterSendResponse: (param: RouteHookParamsAfter) => RouteHookNext;
						},
						{
							// eslint-disable-next-line @typescript-eslint/method-signature-style
							readonly afterSendResponse: (param: RouteHookParamsAfter) => RouteHookNext;
						},
					];
					readonly metadata: readonly [];
				},
				{}
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
				{}
			>,
			"strict"
		>;
	});
});
