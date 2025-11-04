import { type Process, type ProcessStep, processStepKind, type ProcessBuilder, stepKind, useProcessBuilder, type Request, type ExtractStep, extractStepKind } from "@core";
import { builderKind, DPE, type ExpectType } from "@duplojs/utils";

describe("process builder process method", () => {
	it("exec", () => {
		const process = useProcessBuilder()
			.export();

		const processBuilder = useProcessBuilder()
			.exec(process);

		expect({ ...processBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					options: undefined,
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
			typeof processBuilder,
			ProcessBuilder<
				{
					readonly hooks: readonly [];
					readonly options: undefined;
					readonly steps: readonly [
						ProcessStep<{
							readonly process: typeof process;
							readonly options: undefined;
							readonly import: undefined;
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
			.export();

		const processBuilder = useProcessBuilder()
			.exec(process, { options: { test: false } });

		expect({ ...processBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					options: undefined,
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
			typeof processBuilder,
			ProcessBuilder<
				{
					readonly hooks: readonly [];
					readonly options: undefined;
					readonly steps: readonly [
						ProcessStep<{
							readonly process: typeof process;
							readonly options: { test: boolean };
							readonly import: undefined;
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
			.export();

		const processBuilder = useProcessBuilder()
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
			typeof processBuilder,
			ProcessBuilder<
				// @ts-expect-error process input function options
				{
					readonly hooks: readonly [];
					readonly options: undefined;
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
						// @ts-expect-error process input function options
						ProcessStep<{
							readonly process: typeof process;
							// eslint-disable-next-line @typescript-eslint/method-signature-style
							readonly options: (floor: { body: string }) => { test: false };
							readonly import: undefined;
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
			.export(["body"]);

		const processBuilder = useProcessBuilder()
			.exec(process, { import: ["body"] });

		expect({ ...processBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					options: undefined,
					steps: [
						{
							[processStepKind.runTimeKey]: null,
							[stepKind.runTimeKey]: null,
							definition: {
								process,
								import: ["body"],
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
					readonly hooks: readonly [];
					readonly options: undefined;
					readonly steps: readonly [
						ProcessStep<{
							readonly process: typeof process;
							readonly options: undefined;
							readonly import: readonly ["body"];
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
			.export(["body", "query"]);

		const processBuilder = useProcessBuilder()
			.exec(process, { import: ["body", "query"] });

		expect({ ...processBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					options: undefined,
					steps: [
						{
							[processStepKind.runTimeKey]: null,
							[stepKind.runTimeKey]: null,
							definition: {
								process,
								import: ["body", "query"],
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
					readonly hooks: readonly [];
					readonly options: undefined;
					readonly steps: readonly [
						ProcessStep<{
							readonly process: typeof process;
							readonly options: undefined;
							readonly import: readonly ["body", "query"];
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
			.export();

		const processBuilder = useProcessBuilder()
			.exec(process);

		expect({ ...processBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					options: undefined,
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
			typeof processBuilder,
			ProcessBuilder<
				{
					readonly hooks: readonly [];
					readonly options: undefined;
					readonly steps: readonly [
						ProcessStep<{
							readonly process: typeof process;
							readonly options: undefined;
							readonly import: undefined;
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
