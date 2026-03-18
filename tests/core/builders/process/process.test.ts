import { type Process, type ProcessStep, processStepKind, type ProcessBuilder, stepKind, useProcessBuilder, type Request, type ExtractStep, extractStepKind, IgnoreByRouteStoreMetadata, type Metadata } from "@core";
import { builderKind, DPE, type ExpectType } from "@duplojs/utils";

describe("process builder process method", () => {
	it("exec", () => {
		const process = useProcessBuilder()
			.exports();

		const processBuilder = useProcessBuilder()
			.exec(process, undefined, IgnoreByRouteStoreMetadata());

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
					readonly hooks: readonly [];
					readonly options: undefined;
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
					readonly hooks: readonly [];
					readonly options: undefined;
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

		const processBuilder = useProcessBuilder()
			.exec(process, { imports: ["body"] });

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
			typeof processBuilder,
			ProcessBuilder<
				{
					readonly hooks: readonly [];
					readonly options: undefined;
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

		const processBuilder = useProcessBuilder()
			.exec(process, { imports: ["body", "query"] });

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
			typeof processBuilder,
			ProcessBuilder<
				{
					readonly hooks: readonly [];
					readonly options: undefined;
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
