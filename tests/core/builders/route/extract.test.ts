import { type ExtractStep, extractStepKind, type RouteBuilder, stepKind, useRouteBuilder, type Request, ResponseContract, IgnoreByRouteStoreMetadata, type Metadata } from "@core";
import { builderKind, DP, DPE, type ExpectType } from "@duplojs/utils";

describe("route builder extract method", () => {
	it("extract", () => {
		const routeBuilder = useRouteBuilder("GET", "/test")
			.extract({ body: DPE.string() }, undefined, IgnoreByRouteStoreMetadata());

		expect({ ...routeBuilder })
			.toStrictEqual(
				expect.objectContaining({
					[builderKind.runTimeKey]: {
						hooks: [],
						method: "GET",
						paths: ["/test"],
						preflightSteps: [],
						bodyController: null,
						metadata: [],
						steps: [
							{
								[extractStepKind.runTimeKey]: null,
								[stepKind.runTimeKey]: null,
								definition: {
									responseContract: undefined,
									shape: {
										body: expect.objectContaining({
											[DP.stringKind.runTimeKey]: null,
										}),
									},
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
					readonly bodyController: null;
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

	it("extract with custom contract", () => {
		const routeBuilder = useRouteBuilder("GET", "/test")
			.extract(
				{ body: DPE.string() },
				ResponseContract.forbidden("test"),
			);

		expect({ ...routeBuilder })
			.toStrictEqual(
				expect.objectContaining({
					[builderKind.runTimeKey]: {
						hooks: [],
						method: "GET",
						paths: ["/test"],
						bodyController: null,
						preflightSteps: [],
						metadata: [],
						steps: [
							{
								[extractStepKind.runTimeKey]: null,
								[stepKind.runTimeKey]: null,
								definition: {
									responseContract: expect.objectContaining({
										[ResponseContract.contractKind.runTimeKey]: null,
										code: "403",
									}),
									shape: {
										body: expect.objectContaining({
											[DP.stringKind.runTimeKey]: null,
										}),
									},
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
					readonly method: "GET";
					readonly paths: readonly ["/test"];
					readonly preflightSteps: readonly [];
					readonly hooks: readonly [];
					readonly bodyController: null;
					readonly steps: readonly [
						ExtractStep<{
							readonly shape: {
								body: DPE.DataParserStringExtended<{
									readonly errorMessage?: string | undefined;
									readonly coerce: boolean;
									readonly checkers: readonly [];
								}>;
							};
							readonly responseContract: ResponseContract.Contract<
								"403",
								"test",
								DP.DataParserEmpty<{
									readonly errorMessage?: string | undefined;
									readonly coerce: boolean;
									readonly checkers: readonly [];
								}>
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

	it("extract with deep extract", () => {
		const routeBuilder = useRouteBuilder("GET", "/test")
			.extract({ body: { test: DPE.string() } });

		expect({ ...routeBuilder })
			.toStrictEqual(
				expect.objectContaining({
					[builderKind.runTimeKey]: {
						hooks: [],
						method: "GET",
						paths: ["/test"],
						bodyController: null,
						preflightSteps: [],
						metadata: [],
						steps: [
							{
								[extractStepKind.runTimeKey]: null,
								[stepKind.runTimeKey]: null,
								definition: {
									responseContract: undefined,
									shape: {
										body: {
											test: expect.objectContaining({
												[DP.stringKind.runTimeKey]: null,
											}),
										},
									},
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
					readonly method: "GET";
					readonly paths: readonly ["/test"];
					readonly preflightSteps: readonly [];
					readonly bodyController: null;
					readonly hooks: readonly [];
					readonly steps: readonly [
						ExtractStep<{
							readonly shape: {
								body: {
									test: DPE.DataParserStringExtended<{
										readonly errorMessage?: string | undefined;
										readonly coerce: boolean;
										readonly checkers: readonly [];
									}>;
								};
							};
							readonly responseContract: undefined;
							readonly metadata: readonly [];
						}>,
					];
					readonly metadata: readonly [];
				},
				{ test: string },
				Request
			>,
			"strict"
		>;
	});

	it("extract with huge object", () => {
		const routeBuilder = useRouteBuilder("GET", "/test")
			.extract({
				body: DPE.object({
					prop1: DPE.string().array(),
					prop2: DPE.bigint().array(),
					prop3: DPE.boolean().array(),
					prop4: DPE.email().array(),
					prop5: DPE.number().array(),
					prop6: DPE.empty().array(),
					prop7: DPE.nil().array(),
					prop8: DPE.object({
						template: DPE.templateLiteral(["test-", DPE.literal([1, 3, "test"])]),
						union: DPE.union([
							DPE.email(),
							DPE.lazy(() => DPE.nil()),
							DPE.object({
								test: DPE.string().optional().array(),
							}),
						])
							.array()
							.optional()
							.nullable(),
					}),
					prop9: DPE.unknown(),
				}),
			});

		expect({ ...routeBuilder })
			.toStrictEqual(
				expect.objectContaining({
					[builderKind.runTimeKey]: {
						hooks: [],
						method: "GET",
						paths: ["/test"],
						bodyController: null,
						preflightSteps: [],
						metadata: [],
						steps: [
							{
								[extractStepKind.runTimeKey]: null,
								[stepKind.runTimeKey]: null,
								definition: {
									responseContract: undefined,
									shape: {
										body: expect.objectContaining({
											[DP.objectKind.runTimeKey]: null,
										}),
									},
									metadata: [],
								},
							},
						],
					},
				}),
			);

		type Check = ExpectType<
			typeof routeBuilder extends RouteBuilder<any, infer F>
				? F
				: never,
			{
				body: {
					prop1: string[];
					prop2: bigint[];
					prop3: boolean[];
					prop4: string[];
					prop5: number[];
					prop6: undefined[];
					prop7: null[];
					prop8: {
						template: "test-1" | "test-test" | "test-3";
						union?:
							| (string | { test: (string | undefined)[] } | null)[]
							| null
							| undefined;
					};
					prop9: unknown;
				};
			},
			"strict"
		>;
	});
});
