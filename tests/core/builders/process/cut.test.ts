import { cutStepKind, extractStepKind, ResponseContract, type ProcessBuilder, stepKind, useProcessBuilder, type Request, type CutStep, type CutStepFunctionParams, type PredictedResponse, type CutStepFunctionOutput, type ExtractStep, IgnoreByRouteStoreMetadata, type Metadata } from "@core";
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
				IgnoreByRouteStoreMetadata(),
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
								metadata: [IgnoreByRouteStoreMetadata()],
							},
						},
					],
					metadata: [],
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
							readonly metadata: readonly [];
						}>,
						CutStep<{
							readonly responseContract: ResponseContract.Contract<
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
									PredictedResponse<"403", "test", undefined>
								>
							): MaybePromise<
								| PredictedResponse<"403", "test", undefined>
								| CutStepFunctionOutput<{}>
							>;
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
								metadata: [],
							},
						},
					],
					metadata: [],
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
							readonly responseContract: readonly [
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
									| PredictedResponse<"403", "test", undefined>
									| PredictedResponse<"404", "notF", string>
								>
							): MaybePromise<
								| PredictedResponse<"403", "test", undefined>
								| PredictedResponse<"404", "notF", string>
								| CutStepFunctionOutput<{}>
							>;
							readonly metadata: readonly [];
						}>,
					];
					readonly metadata: readonly [];
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
								metadata: [],
							},
						},
					],
					metadata: [],
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
							readonly metadata: readonly [];
						}>,
						CutStep<{
							readonly responseContract: ResponseContract.Contract<
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
									| PredictedResponse<"403", "test", undefined>
								>
							): MaybePromise<
								| PredictedResponse<"403", "test", undefined>
								| CutStepFunctionOutput<{ test: boolean }>
							>;
							readonly metadata: readonly [];
						}>,
					];
					readonly metadata: readonly [];
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
								metadata: [],
							},
						},
					],
					metadata: [],
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
							readonly metadata: readonly [];
						}>,
						CutStep<{
							readonly responseContract: ResponseContract.Contract<
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
									| PredictedResponse<"403", "test", undefined>
								>
							): MaybePromise<
								| PredictedResponse<"403", "test", undefined>
								| CutStepFunctionOutput<{ test: boolean }>
								| CutStepFunctionOutput<{ toto: string }>
							>;
							readonly metadata: readonly [];
						}>,
					];
					readonly metadata: readonly [];
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
								metadata: [],
							},
						},
					],
					metadata: [],
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
							readonly metadata: readonly [];
						}>,
						CutStep<{
							readonly responseContract: ResponseContract.Contract<
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
									| PredictedResponse<"403", "test", undefined>
								>
							): MaybePromise<
								| PredictedResponse<"403", "test", undefined>
							>;
							readonly metadata: readonly [];
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
});
