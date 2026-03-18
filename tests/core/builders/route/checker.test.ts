import { checkerStepKind, extractStepKind, ResponseContract, type RouteBuilder, stepKind, useCheckerBuilder, useRouteBuilder, type Request, type CheckerStep, type ExtractStep, type Floor, IgnoreByRouteStoreMetadata, type Metadata } from "@core";
import { builderKind, type DP, DPE, type ExpectType, O } from "@duplojs/utils";

describe("route builder checker method", () => {
	it("check", () => {
		const checker = useCheckerBuilder()
			.handler(
				(input: string, { output }) => input ? output("ok", true) : output("error", null),
			);

		const routeBuilder = useRouteBuilder("GET", "/test")
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
					bodyController: null,
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
							readonly metadata: readonly [];
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
							readonly metadata: readonly [Metadata<"ignore-by-route-store", unknown>];
						}>,
					];
					readonly metadata: readonly [];
				},
				{ body: string }
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

		const routeBuilder = useRouteBuilder("GET", "/test")
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

		expect({ ...routeBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					method: "GET",
					paths: ["/test"],
					preflightSteps: [],
					bodyController: null,
					metadata: [],
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
							readonly responseContract: undefined;
							readonly metadata: readonly [];
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
							readonly metadata: readonly [];
						}>,
					];
					readonly metadata: readonly [];
				},
				{ body: string }
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

		const routeBuilder = useRouteBuilder("GET", "/test")
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

		expect({ ...routeBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					method: "GET",
					paths: ["/test"],
					preflightSteps: [],
					bodyController: null,
					metadata: [],
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
							readonly responseContract: undefined;
							readonly metadata: readonly [];
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
							readonly metadata: readonly [];
						}>,
					];
					readonly metadata: readonly [];
				},
				{ body: string }
			>,
			"strict"
		>;
	});

	it("check with indexing", () => {
		const checker = useCheckerBuilder()
			.handler(
				(input: string, { output }) => input ? output("ok", true) : output("error", null),
			);

		const routeBuilder = useRouteBuilder("GET", "/test")
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

		expect({ ...routeBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					method: "GET",
					paths: ["/test"],
					preflightSteps: [],
					bodyController: null,
					metadata: [],
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
							readonly responseContract: undefined;
							readonly metadata: readonly [];
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
							readonly metadata: readonly [];
						}>,
					];
					readonly metadata: readonly [];
				},
				{
					body: string;
					myValueCheck: boolean;
				}
			>,
			"strict"
		>;
	});
});
