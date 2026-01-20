import { extractStepKind, ResponseContract, stepKind, useCheckerBuilder, type Request, type ExtractStep, createPresetChecker, presetCheckerStepKind, type PresetCheckerStep, useProcessBuilder, type ProcessBuilder, IgnoreByRouteStoreMetadata, type Metadata } from "@core";
import { builderKind, DPE, type ExpectType } from "@duplojs/utils";

describe("process builder preset checker method", () => {
	it("presetCheck", () => {
		const checker = useCheckerBuilder()
			.handler(
				(input: string, { output }) => input ? output("ok", true) : output("error", null),
			);

		const presetChecker = createPresetChecker(
			checker,
			{
				result: "ok",
				otherwise: ResponseContract.badRequest("test"),
			},
		);

		const routeBuilder = useProcessBuilder()
			.extract({ body: DPE.string() })
			.presetCheck(
				presetChecker,
				({ body }) => {
					type Check = ExpectType<
						typeof body,
						string,
						"strict"
					>;

					return body;
				},
				IgnoreByRouteStoreMetadata(),
			);

		expect({ ...routeBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					options: undefined,
					metadata: [],
					steps: [
						expect.objectContaining({
							[extractStepKind.runTimeKey]: null,
						}),
						{
							[presetCheckerStepKind.runTimeKey]: null,
							[stepKind.runTimeKey]: null,
							definition: {
								presetChecker,
								input: expect.any(Function),
								metadata: [IgnoreByRouteStoreMetadata()],
							},
						},
					],
				},
			}),
		);

		type Check = ExpectType<
			typeof routeBuilder,
			ProcessBuilder<
				{
					readonly options: undefined;
					readonly hooks: readonly [];
					readonly steps: readonly [
						ExtractStep<{
							readonly shape: {
								body: DPE.DataParserStringExtended<{
									readonly errorMessage?: string | undefined;
									readonly coerce: boolean;
									readonly checkers: readonly [];
								}>;
							};
							readonly responseContract: undefined;
							readonly metadata: readonly [];
						}>,
						PresetCheckerStep<{
							readonly presetChecker: typeof presetChecker;
							input(floor: { body: string }): string;
							readonly metadata: readonly [Metadata<"ignore-by-route-store", unknown>];
						}>,
					];
					readonly metadata: readonly [];
				},
				{ body: string },
				Request
			>,
			"strict"
		>;
	});

	it("presetCheck with indexing", () => {
		const checker = useCheckerBuilder()
			.handler(
				(input: string, { output }) => input ? output("ok", true) : output("error", null),
			);

		const presetChecker = createPresetChecker(
			checker,
			{
				result: "ok",
				otherwise: ResponseContract.badRequest("test"),
				indexing: "superValue",
			},
		);

		const routeBuilder = useProcessBuilder()
			.extract({ body: DPE.string() })
			.presetCheck(
				presetChecker,
				({ body }) => body,
			);

		expect({ ...routeBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					options: undefined,
					metadata: [],
					steps: [
						expect.objectContaining({
							[extractStepKind.runTimeKey]: null,
						}),
						{
							[presetCheckerStepKind.runTimeKey]: null,
							[stepKind.runTimeKey]: null,
							definition: {
								presetChecker,
								input: expect.any(Function),
								metadata: [],
							},
						},
					],
				},
			}),
		);

		type Check = ExpectType<
			typeof routeBuilder,
			ProcessBuilder<
				{
					readonly options: undefined;
					readonly hooks: readonly [];
					readonly steps: readonly [
						ExtractStep<{
							readonly shape: {
								body: DPE.DataParserStringExtended<{
									readonly errorMessage?: string | undefined;
									readonly coerce: boolean;
									readonly checkers: readonly [];
								}>;
							};
							readonly responseContract: undefined;
							readonly metadata: readonly [];
						}>,
						PresetCheckerStep<{
							readonly presetChecker: typeof presetChecker;
							input(floor: { body: string }): string;
							readonly metadata: readonly [];
						}>,
					];
					readonly metadata: readonly [];
				},
				{
					body: string;
					superValue: boolean;
				},
				Request
			>,
			"strict"
		>;
	});
});
