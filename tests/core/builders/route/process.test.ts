import { type ProcessStep, processStepKind, type RouteBuilder, stepKind, useProcessBuilder, useRouteBuilder, type Request, type ExtractStep, extractStepKind, IgnoreByRouteStoreMetadata, type Metadata } from "@core";
import { builderKind, DPE, type ExpectType } from "@duplojs/utils";

describe("route builder process method", () => {
	it("exec", () => {
		const process = useProcessBuilder()
			.exports();

		const routeBuilder = useRouteBuilder("GET", "/test")
			.exec(process, undefined, IgnoreByRouteStoreMetadata());

		expect({ ...routeBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					method: "GET",
					paths: ["/test"],
					preflightSteps: [],
					bodyController: null,
					steps: [
						{
							[processStepKind.runTimeKey]: null,
							[stepKind.runTimeKey]: null,
							definition: {
								process,
								metadata: [IgnoreByRouteStoreMetadata()],
							},
						},
					],
					metadata: [],
				},
			}),
		);

		type Check = ExpectType<
			typeof routeBuilder,
			RouteBuilder<
				{
					readonly hooks: readonly [];
					readonly paths: readonly ["/test"];
					readonly method: "GET";
					readonly preflightSteps: readonly [];
					readonly bodyController: null;
					readonly steps: readonly [
						ProcessStep<{
							readonly process: typeof process;
							readonly options: undefined;
							readonly imports: undefined;
							readonly metadata: readonly [Metadata<"ignore-by-route-store", unknown>];
						}>,
					];
					readonly metadata: readonly [];
				},
				{}
			>,
			"strict"
		>;
	});

	it("exec with option", () => {
		const process = useProcessBuilder({
			options: {
				test: true,
			},
		})
			.exports();

		const routeBuilder = useRouteBuilder("GET", "/test")
			.exec(process, { options: { test: false } });

		expect({ ...routeBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					method: "GET",
					paths: ["/test"],
					bodyController: null,
					preflightSteps: [],
					steps: [
						{
							[processStepKind.runTimeKey]: null,
							[stepKind.runTimeKey]: null,
							definition: {
								process,
								options: { test: false },
								metadata: [],
							},
						},
					],
					metadata: [],
				},
			}),
		);

		type Check = ExpectType<
			typeof routeBuilder,
			RouteBuilder<
				{
					readonly hooks: readonly [];
					readonly paths: readonly ["/test"];
					readonly method: "GET";
					readonly preflightSteps: readonly [];
					readonly bodyController: null;
					readonly steps: readonly [
						ProcessStep<{
							readonly process: typeof process;
							readonly options: { test: boolean };
							readonly imports: undefined;
							readonly metadata: readonly [];
						}>,
					];
					readonly metadata: readonly [];
				},
				{}
			>,
			"strict"
		>;
	});

	it("exec with callback option", () => {
		const process = useProcessBuilder({
			options: {
				test: true,
			},
		})
			.exports();

		const routeBuilder = useRouteBuilder("GET", "/test")
			.extract({ body: DPE.string() })
			.exec(
				process,
				{
					options: (floor) => {
						type Check = ExpectType<
							typeof floor,
							{
								body: string;
							},
							"strict"
						>;

						return {
							test: false,
						};
					},
				},
			);

		expect({ ...routeBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					method: "GET",
					paths: ["/test"],
					bodyController: null,
					preflightSteps: [],
					steps: [
						expect.objectContaining({
							[extractStepKind.runTimeKey]: null,
						}),
						{
							[processStepKind.runTimeKey]: null,
							[stepKind.runTimeKey]: null,
							definition: {
								process,
								options: expect.any(Function),
								metadata: [],
							},
						},
					],
					metadata: [],
				},
			}),
		);

		type Check = ExpectType<
			typeof routeBuilder,
			RouteBuilder<
				{
					readonly hooks: readonly [];
					readonly paths: readonly ["/test"];
					readonly method: "GET";
					readonly preflightSteps: readonly [];
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
						ProcessStep<{
							readonly process: typeof process;
							// eslint-disable-next-line @typescript-eslint/method-signature-style
							readonly options: (floor: { body: string }) => { test: false };
							readonly imports: undefined;
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

	it("exec with import", () => {
		const process = useProcessBuilder()
			.extract({
				query: DPE.number(),
				body: DPE.string(),
			})
			.exports(["body"]);

		const routeBuilder = useRouteBuilder("GET", "/test")
			.exec(process, { imports: ["body"] });

		expect({ ...routeBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					method: "GET",
					paths: ["/test"],
					bodyController: null,
					preflightSteps: [],
					steps: [
						{
							[processStepKind.runTimeKey]: null,
							[stepKind.runTimeKey]: null,
							definition: {
								process,
								imports: ["body"],
								metadata: [],
							},
						},
					],
					metadata: [],
				},
			}),
		);

		type Check = ExpectType<
			typeof routeBuilder,
			RouteBuilder<
				{
					readonly hooks: readonly [];
					readonly paths: readonly ["/test"];
					readonly method: "GET";
					readonly preflightSteps: readonly [];
					readonly bodyController: null;
					readonly steps: readonly [
						ProcessStep<{
							readonly process: typeof process;
							readonly options: undefined;
							readonly imports: readonly ["body"];
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

	it("exec with multi import", () => {
		const process = useProcessBuilder()
			.extract({
				query: DPE.number(),
				body: DPE.string(),
			})
			.exports(["body", "query"]);

		const routeBuilder = useRouteBuilder("GET", "/test")
			.exec(process, { imports: ["body", "query"] });

		expect({ ...routeBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					method: "GET",
					paths: ["/test"],
					bodyController: null,
					preflightSteps: [],
					steps: [
						{
							[processStepKind.runTimeKey]: null,
							[stepKind.runTimeKey]: null,
							definition: {
								process,
								imports: ["body", "query"],
								metadata: [],
							},
						},
					],
					metadata: [],
				},
			}),
		);

		type Check = ExpectType<
			typeof routeBuilder,
			RouteBuilder<
				{
					readonly hooks: readonly [];
					readonly paths: readonly ["/test"];
					readonly method: "GET";
					readonly preflightSteps: readonly [];
					readonly bodyController: null;
					readonly steps: readonly [
						ProcessStep<{
							readonly process: typeof process;
							readonly options: undefined;
							readonly imports: readonly ["body", "query"];
							readonly metadata: readonly [];
						}>,
					];
					readonly metadata: readonly [];
				},
				{
					body: string;
					query: number;
				}
			>,
			"strict"
		>;
	});
});
