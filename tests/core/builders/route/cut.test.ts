import { cutStepKind, extractStepKind, ResponseContract, type RouteBuilder, stepKind, useRouteBuilder, type Request, type CutStep, type CutStepFunctionParams, type PredictedResponse, type CutStepFunctionOutput, type ExtractStep, IgnoreByRouteStoreMetadata, type Metadata } from "@core";
import { builderKind, type DP, DPE, type ExpectType } from "@duplojs/utils";
import { type MaybePromise } from "rollup";

describe("route builder cut method", () => {
	it("cut", () => {
		const routeBuilder = useRouteBuilder("GET", "/test")
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

		expect({ ...routeBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					method: "GET",
					paths: ["/test"],
					preflightSteps: [],
					metadata: [],
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
				},
			}),
		);

		type Check = ExpectType<
			typeof routeBuilder,
			RouteBuilder<
				{
					readonly method: "GET";
					readonly paths: readonly ["/test"];
					readonly preflightSteps: readonly [];
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
		const routeBuilder = useRouteBuilder("GET", "/test")
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

		expect({ ...routeBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					method: "GET",
					paths: ["/test"],
					preflightSteps: [],
					metadata: [],
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
				},
			}),
		);

		type Check = ExpectType<
			typeof routeBuilder,
			RouteBuilder<
				{
					readonly paths: readonly ["/test"];
					readonly method: "GET";
					readonly preflightSteps: readonly [];
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
		const routeBuilder = useRouteBuilder("GET", "/test")
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

		expect({ ...routeBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					method: "GET",
					paths: ["/test"],
					preflightSteps: [],
					metadata: [],
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
				},
			}),
		);

		type Check = ExpectType<
			typeof routeBuilder,
			RouteBuilder<
				{
					readonly paths: readonly ["/test"];
					readonly method: "GET";
					readonly preflightSteps: readonly [];
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
		const routeBuilder = useRouteBuilder("GET", "/test")
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

		expect({ ...routeBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					method: "GET",
					paths: ["/test"],
					preflightSteps: [],
					metadata: [],
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
				},
			}),
		);

		type Check = ExpectType<
			typeof routeBuilder,
			RouteBuilder<
				{
					readonly paths: readonly ["/test"];
					readonly method: "GET";
					readonly preflightSteps: readonly [];
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
		const routeBuilder = useRouteBuilder("GET", "/test")
			.extract({ body: DPE.string() })
			.cut(
				ResponseContract.forbidden("test"),
				(floor, { response }) => response("test"),
			);

		expect({ ...routeBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					method: "GET",
					paths: ["/test"],
					preflightSteps: [],
					metadata: [],
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
				},
			}),
		);

		type Check = ExpectType<
			typeof routeBuilder,
			RouteBuilder<
				{
					readonly paths: readonly ["/test"];
					readonly method: "GET";
					readonly preflightSteps: readonly [];
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
