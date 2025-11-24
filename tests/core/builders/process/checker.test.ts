import { checkerStepKind, extractStepKind, ResponseContract, type ProcessBuilder, stepKind, useCheckerBuilder, useProcessBuilder, type Request, type CheckerStep, type ExtractStep } from "@core";
import { builderKind, type DP, DPE, type ExpectType, O } from "@duplojs/utils";

describe("process builder checker method", () => {
	it("check", () => {
		const checker = useCheckerBuilder()
			.handler(
				(input: string, { output }) => input ? output("ok", true) : output("error", null),
			);

		const processBuilder = useProcessBuilder()
			.extract({ body: DPE.string() })
			.check(
				checker,
				{
					input: ({ body }) => {
						type Check = ExpectType<
							typeof body,
							string,
							"strict"
						>;

						return body;
					},
					result: "ok",
					otherwise: ResponseContract.badRequest("test"),
				},
			);

		expect({ ...processBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					options: undefined,
					steps: [
						expect.objectContaining({
							[extractStepKind.runTimeKey]: null,
						}),
						{
							[checkerStepKind.runTimeKey]: null,
							[stepKind.runTimeKey]: null,
							definition: {
								checker,
								input: expect.any(Function),
								result: "ok",
								responseContract: expect.objectContaining({
									[ResponseContract.contractKind.runTimeKey]: null,
									code: "400",
								}),
							},
						},
					],
				},
			}),
		);

		type Check = ExpectType<
			typeof processBuilder,
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
						}>,
						CheckerStep<{
							readonly checker: typeof checker;
							input(floor: { body: string }): string;
							readonly options: undefined;
							readonly indexing: undefined;
							readonly result: "ok";
							readonly responseContract: ResponseContract.Contract<
								"400",
								"test",
								DP.DataParserEmpty<{
									readonly errorMessage?: string | undefined;
									readonly coerce: boolean;
									readonly checkers: readonly [];
								}>
							>;
						}>,
					];
				},
				{ body: string },
				Request
			>,
			"strict"
		>;
	});

	it("check with options", () => {
		const checker = useCheckerBuilder({ options: { test: true } })
			.handler(
				(input: string, { output, options }) => options.test
					? output("ok", true)
					: output("error", null),
			);

		const processBuilder = useProcessBuilder()
			.extract({ body: DPE.string() })
			.check(
				checker,
				{
					input: O.getProperty("body"),
					options: { test: false },
					result: "ok",
					otherwise: ResponseContract.badRequest("test"),
				},
			);

		expect({ ...processBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					options: undefined,
					steps: [
						expect.objectContaining({
							[extractStepKind.runTimeKey]: null,
						}),
						{
							[checkerStepKind.runTimeKey]: null,
							[stepKind.runTimeKey]: null,
							definition: {
								checker,
								input: expect.any(Function),
								result: "ok",
								options: {
									test: false,
								},
								responseContract: expect.objectContaining({
									[ResponseContract.contractKind.runTimeKey]: null,
									code: "400",
								}),
							},
						},
					],
				},
			}),
		);

		type Check = ExpectType<
			typeof processBuilder,
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
						}>,
						CheckerStep<{
							readonly checker: typeof checker;
							input(floor: { body: string }): string;
							readonly options: {
								test: boolean;
							};
							readonly indexing: undefined;
							readonly result: "ok";
							readonly responseContract: ResponseContract.Contract<
								"400",
								"test",
								DP.DataParserEmpty<{
									readonly errorMessage?: string | undefined;
									readonly coerce: boolean;
									readonly checkers: readonly [];
								}>
							>;
						}>,
					];
				},
				{ body: string },
				Request
			>,
			"strict"
		>;
	});

	it("check with callback options", () => {
		const checker = useCheckerBuilder({ options: { test: true } })
			.handler(
				(input: string, { output, options }) => options.test
					? output("ok", true)
					: output("error", null),
			);

		const processBuilder = useProcessBuilder()
			.extract({ body: DPE.string() })
			.check(
				checker,
				{
					input: O.getProperty("body"),
					options: (floor) => {
						type Check = ExpectType<
							typeof floor,
							{ body: string },
							"strict"
						>;

						return { test: false };
					},
					result: "ok",
					otherwise: ResponseContract.badRequest("test"),
				},
			);

		expect({ ...processBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					options: undefined,
					steps: [
						expect.objectContaining({
							[extractStepKind.runTimeKey]: null,
						}),
						{
							[checkerStepKind.runTimeKey]: null,
							[stepKind.runTimeKey]: null,
							definition: {
								checker,
								input: expect.any(Function),
								result: "ok",
								options: expect.any(Function),
								responseContract: expect.objectContaining({
									[ResponseContract.contractKind.runTimeKey]: null,
									code: "400",
								}),
							},
						},
					],
				},
			}),
		);

		type Check = ExpectType<
			typeof processBuilder,
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
						}>,
						CheckerStep<{
							readonly checker: typeof checker;
							input(floor: { body: string }): string;
							// eslint-disable-next-line @typescript-eslint/method-signature-style
							readonly options: (floor: { body: string }) => { test: false };
							readonly indexing: undefined;
							readonly result: "ok";
							readonly responseContract: ResponseContract.Contract<
								"400",
								"test",
								DP.DataParserEmpty<{
									readonly errorMessage?: string | undefined;
									readonly coerce: boolean;
									readonly checkers: readonly [];
								}>
							>;
						}>,
					];
				},
				{ body: string },
				Request
			>,
			"strict"
		>;
	});

	it("check with indexing", () => {
		const checker = useCheckerBuilder()
			.handler(
				(input: string, { output }) => input ? output("ok", true) : output("error", null),
			);

		const processBuilder = useProcessBuilder()
			.extract({ body: DPE.string() })
			.check(
				checker,
				{
					input: O.getProperty("body"),
					result: "ok",
					indexing: "myValueCheck",
					otherwise: ResponseContract.badRequest("test"),
				},
			);

		expect({ ...processBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					options: undefined,
					steps: [
						expect.objectContaining({
							[extractStepKind.runTimeKey]: null,
						}),
						{
							[checkerStepKind.runTimeKey]: null,
							[stepKind.runTimeKey]: null,
							definition: {
								checker,
								input: expect.any(Function),
								result: "ok",
								indexing: "myValueCheck",
								responseContract: expect.objectContaining({
									[ResponseContract.contractKind.runTimeKey]: null,
									code: "400",
								}),
							},
						},
					],
				},
			}),
		);

		type Check = ExpectType<
			typeof processBuilder,
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
						}>,
						CheckerStep<{
							readonly checker: typeof checker;
							input(floor: { body: string }): string;
							readonly options: undefined;
							readonly indexing: "myValueCheck";
							readonly result: "ok";
							readonly responseContract: ResponseContract.Contract<
								"400",
								"test",
								DP.DataParserEmpty<{
									readonly errorMessage?: string | undefined;
									readonly coerce: boolean;
									readonly checkers: readonly [];
								}>
							>;
						}>,
					];
				},
				{
					body: string;
					myValueCheck: boolean;
				},
				Request
			>,
			"strict"
		>;
	});
});
