import { type ProcessStep, processStepKind, type RouteBuilder, stepKind, useProcessBuilder, useRouteBuilder, type Request, type ExtractStep, extractStepKind, usePreflightBuilder, type PreflightBuilder } from "@core";
import { builderKind, DPE, type ExpectType } from "@duplojs/utils";

describe("preflight builder process method", () => {
	it("exec", () => {
		const process = useProcessBuilder()
			.export();

		const preflightBuilder = usePreflightBuilder()
			.exec(process);

		expect({ ...preflightBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					preflightSteps: [
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
			typeof preflightBuilder,
			PreflightBuilder<
				{
					readonly preflightSteps: readonly [
						ProcessStep<{
							readonly process: typeof process;
							readonly options: undefined;
							readonly imports: undefined;
						}>,
					];
					readonly hooks: readonly [];
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
			.export();

		const preflightBuilder = usePreflightBuilder()
			.exec(process, { options: { test: false } });

		expect({ ...preflightBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					preflightSteps: [
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
			typeof preflightBuilder,
			PreflightBuilder<
				{
					readonly preflightSteps: readonly [
						ProcessStep<{
							readonly process: typeof process;
							readonly options: { test: boolean };
							readonly imports: undefined;
						}>,
					];
					readonly hooks: readonly [];
				},
				{},
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
			.export(["body"]);

		const preflightBuilder = usePreflightBuilder()
			.exec(process, { imports: ["body"] });

		expect({ ...preflightBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					preflightSteps: [
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
			typeof preflightBuilder,
			PreflightBuilder<
				{
					readonly preflightSteps: readonly [
						ProcessStep<{
							readonly process: typeof process;
							readonly options: undefined;
							readonly imports: readonly ["body"];
						}>,
					];
					readonly hooks: readonly [];
				},
				{ body: string },
				Request
			>,
			"strict"
		>;
	});

	it("exec with callback option", () => {
		const processWithExport = useProcessBuilder()
			.extract({
				query: DPE.number(),
				body: DPE.string(),
			})
			.export(["body"]);

		const process = useProcessBuilder({
			options: {
				test: true,
			},
		})
			.export();

		const preflightBuilder = usePreflightBuilder()
			.exec(
				processWithExport,
				{
					imports: ["body"],
				},
			)
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

		expect({ ...preflightBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					preflightSteps: [
						{
							[processStepKind.runTimeKey]: null,
							[stepKind.runTimeKey]: null,
							definition: {
								process: processWithExport,
								imports: ["body"],
							},
						},
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
			typeof preflightBuilder,
			PreflightBuilder<
				// @ts-expect-error process input function options
				{
					readonly preflightSteps: readonly [
						ProcessStep<{
							readonly process: typeof processWithExport;
							readonly options: undefined;
							readonly imports: readonly ["body"];
						}>,
						// @ts-expect-error process input function options
						ProcessStep<{
							readonly process: typeof process;
							// eslint-disable-next-line @typescript-eslint/method-signature-style
							readonly options: (floor: { body: string }) => { test: false };
							readonly imports: undefined;
						}>,
					];
					readonly hooks: readonly [];
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
			.export(["body", "query"]);

		const preflightBuilder = usePreflightBuilder()
			.exec(process, { imports: ["body", "query"] });

		expect({ ...preflightBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					preflightSteps: [
						{
							[processStepKind.runTimeKey]: null,
							[stepKind.runTimeKey]: null,
							definition: {
								process: process,
								imports: ["body", "query"],
							},
						},
					],
				},
			}),
		);

		type Check = ExpectType<
			typeof preflightBuilder,
			PreflightBuilder<
				{
					readonly preflightSteps: readonly [
						ProcessStep<{
							readonly process: typeof process;
							readonly options: undefined;
							readonly imports: readonly ["body", "query"];
						}>,
					];
					readonly hooks: readonly [];
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
			.export();

		const routeBuilder = usePreflightBuilder()
			.exec(process);

		expect({ ...routeBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					preflightSteps: [
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
			PreflightBuilder<
				{
					readonly preflightSteps: readonly [
						ProcessStep<{
							readonly process: typeof process;
							readonly options: undefined;
							readonly imports: undefined;
						}>,
					];
					readonly hooks: readonly [];
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
