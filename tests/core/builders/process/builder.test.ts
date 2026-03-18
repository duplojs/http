import { useProcessBuilder, type ProcessBuilder, IgnoreByRouteStoreMetadata, type Metadata, type RouteHookParamsAfter, type RouteHookNext } from "@core";
import { builderKind, type ExpectType } from "@duplojs/utils";

describe("process builder", () => {
	it("useProcessBuilder", () => {
		const processBuilder = useProcessBuilder({ metadata: [IgnoreByRouteStoreMetadata()] });

		expect({ ...processBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					options: undefined,
					steps: [],
					metadata: [IgnoreByRouteStoreMetadata()],
				},
			}),
		);

		type Check = ExpectType<
			typeof processBuilder,
			ProcessBuilder<
				{
					readonly steps: readonly [];
					readonly options: undefined;
					readonly hooks: readonly [];
					readonly metadata: readonly [Metadata<"ignore-by-route-store", unknown>];
				},
				{}
			>,
			"strict"
		>;
	});

	it("useProcessBuilder with options", () => {
		const processBuilder = useProcessBuilder({
			options: { test: true },
		});

		expect({ ...processBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					options: { test: true },
					steps: [],
					metadata: [],
				},
			}),
		);

		type Check = ExpectType<
			typeof processBuilder,
			ProcessBuilder<
				{
					readonly steps: readonly [];
					readonly options: {
						test: boolean;
					};
					readonly hooks: readonly [];
					readonly metadata: readonly [];
				},
				{ options: { test: boolean } }
			>,
			"strict"
		>;
	});

	it("useProcessBuilder with hook", () => {
		const routeBuilder = useProcessBuilder({
			hooks: [
				{ afterSendResponse: ({ next }) => next() },
				{ afterSendResponse: ({ next }) => next() },
			],
		});

		expect({ ...routeBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [
						{ afterSendResponse: expect.any(Function) },
						{ afterSendResponse: expect.any(Function) },
					],
					options: undefined,
					steps: [],
					metadata: [],
				},
			}),
		);

		type Check = ExpectType<
			typeof routeBuilder,
			ProcessBuilder<
				{
					readonly steps: readonly [];
					readonly options: undefined;
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
});
