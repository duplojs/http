import { type Process, type ProcessStep, processStepKind, type RouteBuilder, stepKind, useProcessBuilder, useRouteBuilder, type Request, type ExtractStep, extractStepKind } from "@core";
import { builderKind, DPE, type ExpectType } from "@duplojs/utils";

describe("route builder process method", () => {
	it("exec", () => {
		const process = useProcessBuilder()
			.exports();

		const routeBuilder = useRouteBuilder("GET", "/test")
			.exec(process);

		expect({ ...routeBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					method: "GET",
					paths: ["/test"],
					preflightSteps: [],
					steps: [
						{
							[processStepKind.runTimeKey]: null,
							[stepKind.runTimeKey]: null,
							definition: {
								process,
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
					readonly hooks: readonly [];
					readonly paths: readonly ["/test"];
					readonly method: "GET";
					readonly preflightSteps: readonly [];
					readonly steps: readonly [
						ProcessStep<{
							readonly process: typeof process;
							readonly options: undefined;
							readonly imports: undefined;
						}>,
					];
				},
				{},
				Request
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
					preflightSteps: [],
					steps: [
						{
							[processStepKind.runTimeKey]: null,
							[stepKind.runTimeKey]: null,
							definition: {
								process,
								options: { test: false },
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
					readonly hooks: readonly [];
					readonly paths: readonly ["/test"];
					readonly method: "GET";
					readonly preflightSteps: readonly [];
					readonly steps: readonly [
						ProcessStep<{
							readonly process: typeof process;
							readonly options: { test: boolean };
							readonly imports: undefined;
						}>,
					];
				},
				{},
				Request
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
					readonly hooks: readonly [];
					readonly paths: readonly ["/test"];
					readonly method: "GET";
					readonly preflightSteps: readonly [];
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
						ProcessStep<{
							readonly process: typeof process;
							// eslint-disable-next-line @typescript-eslint/method-signature-style
							readonly options: (floor: { body: string }) => { test: false };
							readonly imports: undefined;
						}>,
					];
				},
				{ body: string },
				Request
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
					preflightSteps: [],
					steps: [
						{
							[processStepKind.runTimeKey]: null,
							[stepKind.runTimeKey]: null,
							definition: {
								process,
								imports: ["body"],
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
					readonly hooks: readonly [];
					readonly paths: readonly ["/test"];
					readonly method: "GET";
					readonly preflightSteps: readonly [];
					readonly steps: readonly [
						ProcessStep<{
							readonly process: typeof process;
							readonly options: undefined;
							readonly imports: readonly ["body"];
						}>,
					];
				},
				{ body: string },
				Request
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
					preflightSteps: [],
					steps: [
						{
							[processStepKind.runTimeKey]: null,
							[stepKind.runTimeKey]: null,
							definition: {
								process,
								imports: ["body", "query"],
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
					readonly hooks: readonly [];
					readonly paths: readonly ["/test"];
					readonly method: "GET";
					readonly preflightSteps: readonly [];
					readonly steps: readonly [
						ProcessStep<{
							readonly process: typeof process;
							readonly options: undefined;
							readonly imports: readonly ["body", "query"];
						}>,
					];
				},
				{
					body: string;
					query: number;
				},
				Request
			>,
			"strict"
		>;
	});

	it("exec with process with hook", () => {
		const process = useProcessBuilder({
			hooks: [{ onConstructRequest: ({ addRequestProperties }) => addRequestProperties({ prop: 1 }) }],
		})
			.exports();

		const routeBuilder = useRouteBuilder("GET", "/test")
			.exec(process);

		expect({ ...routeBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					method: "GET",
					paths: ["/test"],
					preflightSteps: [],
					steps: [
						{
							[processStepKind.runTimeKey]: null,
							[stepKind.runTimeKey]: null,
							definition: {
								process,
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
					readonly hooks: readonly [];
					readonly paths: readonly ["/test"];
					readonly method: "GET";
					readonly preflightSteps: readonly [];
					readonly steps: readonly [
						ProcessStep<{
							readonly process: typeof process;
							readonly options: undefined;
							readonly imports: undefined;
						}>,
					];
				},
				{},
				Request & {
					prop: number;
				}
			>,
			"strict"
		>;
	});
});
