import { cutStepKind, extractStepKind, ResponseContract, type ProcessBuilder, stepKind, useProcessBuilder, type Request, type CutStep, type CutStepFunctionParams, type Response, type CutStepFunctionOutput, type ExtractStep } from "@core";
import { builderKind, type DP, DPE, type ExpectType } from "@duplojs/utils";
import { type MaybePromise } from "rollup";

describe("process builder cut method", () => {
	it("cut", () => {
		const processBuilder = useProcessBuilder()
			.extract({ body: DPE.string() })
			.cut(
				ResponseContract.forbidden("test"),
				(floor, { output, response }) => {
					type Check = ExpectType<
						typeof floor,
						{ body: string },
						"strict"
					>;

					if (floor.body) {
						return response("test");
					}

					return output();
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
							[cutStepKind.runTimeKey]: null,
							[stepKind.runTimeKey]: null,
							definition: {
								theFunction: expect.any(Function),
								responseContract: expect.objectContaining({
									[ResponseContract.contractKind.runTimeKey]: null,
									code: "403",
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
						CutStep<{
							responseContract: ResponseContract.Contract<
								"403",
								"test",
								DP.DataParserEmpty<{
									readonly errorMessage?: string | undefined;
									readonly coerce: boolean;
									readonly checkers: readonly [];
								}>
							>;
							theFunction(
								floor: { body: string },
								param: CutStepFunctionParams<
									Request,
									Response<"403", "test", undefined>
								>
							): MaybePromise<
								| Response<"403", "test", undefined>
								| CutStepFunctionOutput<{}>
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

	it("cut with multi contract", () => {
		const processBuilder = useProcessBuilder()
			.cut(
				[ResponseContract.forbidden("test"), ResponseContract.notFound("notF", DPE.string())],
				(floor, { output, response }) => {
					if (true.valueOf()) {
						return response("test");
					} else if (false.valueOf()) {
						return response("notF", "test");
					}

					return output();
				},
			);

		expect({ ...processBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					options: undefined,
					steps: [
						{
							[cutStepKind.runTimeKey]: null,
							[stepKind.runTimeKey]: null,
							definition: {
								theFunction: expect.any(Function),
								responseContract: [
									expect.objectContaining({
										[ResponseContract.contractKind.runTimeKey]: null,
										code: "403",
									}),
									expect.objectContaining({
										[ResponseContract.contractKind.runTimeKey]: null,
										code: "404",
									}),
								],
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
						CutStep<{
							responseContract: [
								ResponseContract.Contract<
									"403",
									"test",
									DP.DataParserEmpty<{
										readonly errorMessage?: string | undefined;
										readonly coerce: boolean;
										readonly checkers: readonly [];
									}>
								>,
								ResponseContract.Contract<
									"404",
									"notF",
									DPE.DataParserStringExtended<{
										readonly errorMessage?: string | undefined;
										readonly coerce: boolean;
										readonly checkers: readonly [];
									}>
								>,
							];
							theFunction(
								floor: {},
								param: CutStepFunctionParams<
									Request,
									| Response<"403", "test", undefined>
									| Response<"404", "notF", string>
								>
							): MaybePromise<
								| Response<"403", "test", undefined>
								| Response<"404", "notF", string>
								| CutStepFunctionOutput<{}>
							>;
						}>,
					];
				},
				{},
				Request
			>,
			"strict"
		>;
	});

	it("cut with output data", () => {
		const processBuilder = useProcessBuilder()
			.extract({ body: DPE.string() })
			.cut(
				ResponseContract.forbidden("test"),
				(floor, { output, response }) => {
					if (true.valueOf()) {
						return response("test");
					}

					return output({ test: true });
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
							[cutStepKind.runTimeKey]: null,
							[stepKind.runTimeKey]: null,
							definition: {
								theFunction: expect.any(Function),
								responseContract: expect.objectContaining({
									[ResponseContract.contractKind.runTimeKey]: null,
									code: "403",
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
						CutStep<{
							responseContract: ResponseContract.Contract<
								"403",
								"test",
								DP.DataParserEmpty<{
									readonly errorMessage?: string | undefined;
									readonly coerce: boolean;
									readonly checkers: readonly [];
								}>
							>;
							theFunction(
								floor: { body: string },
								param: CutStepFunctionParams<
									Request,
									| Response<"403", "test", undefined>
								>
							): MaybePromise<
								| Response<"403", "test", undefined>
								| CutStepFunctionOutput<{ test: boolean }>
							>;
						}>,
					];
				},
				{
					test: boolean;
					body: string;
				},
				Request
			>,
			"strict"
		>;
	});

	it("cut with multi output data", () => {
		const processBuilder = useProcessBuilder()
			.extract({ body: DPE.string() })
			.cut(
				ResponseContract.forbidden("test"),
				(floor, { output, response }) => {
					if (true.valueOf()) {
						return response("test");
					} else if (false.valueOf()) {
						return output({ toto: "string" });
					}

					return output({ test: true });
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
							[cutStepKind.runTimeKey]: null,
							[stepKind.runTimeKey]: null,
							definition: {
								theFunction: expect.any(Function),
								responseContract: expect.objectContaining({
									[ResponseContract.contractKind.runTimeKey]: null,
									code: "403",
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
						CutStep<{
							responseContract: ResponseContract.Contract<
								"403",
								"test",
								DP.DataParserEmpty<{
									readonly errorMessage?: string | undefined;
									readonly coerce: boolean;
									readonly checkers: readonly [];
								}>
							>;
							theFunction(
								floor: { body: string },
								param: CutStepFunctionParams<
									Request,
									| Response<"403", "test", undefined>
								>
							): MaybePromise<
								| Response<"403", "test", undefined>
								| CutStepFunctionOutput<{ test: boolean }>
								| CutStepFunctionOutput<{ toto: string }>

							>;
						}>,
					];
				},
				{
					body: string;
					test: boolean;
				} | {
					body: string;
					toto: string;
				},
				Request
			>,
			"strict"
		>;
	});

	it("cut without output", () => {
		const processBuilder = useProcessBuilder()
			.extract({ body: DPE.string() })
			.cut(
				ResponseContract.forbidden("test"),
				(floor, { response }) => response("test"),
			);

		expect({ ...processBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					option: undefined,
					steps: [
						expect.objectContaining({
							[extractStepKind.runTimeKey]: null,
						}),
						{
							[cutStepKind.runTimeKey]: null,
							[stepKind.runTimeKey]: null,
							definition: {
								theFunction: expect.any(Function),
								responseContract: expect.objectContaining({
									[ResponseContract.contractKind.runTimeKey]: null,
									code: "403",
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
						CutStep<{
							responseContract: ResponseContract.Contract<
								"403",
								"test",
								DP.DataParserEmpty<{
									readonly errorMessage?: string | undefined;
									readonly coerce: boolean;
									readonly checkers: readonly [];
								}>
							>;
							theFunction(
								floor: { body: string },
								param: CutStepFunctionParams<
									Request,
									| Response<"403", "test", undefined>
								>
							): MaybePromise<
								| Response<"403", "test", undefined>
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
});
