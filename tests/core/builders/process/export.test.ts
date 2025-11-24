import { type ExtractStep, extractStepKind, type Process, type ProcessExportValue, processKind, type ProcessRequest, stepKind, useProcessBuilder, type Request, type HookParamsOnConstructRequest } from "@core";
import { DP, DPE, type SimplifyTopLevel, type ExpectType } from "@duplojs/utils";

describe("process builder export method", () => {
	it("export", () => {
		const processBuilder = useProcessBuilder()
			.exports();

		expect({ ...processBuilder })
			.toStrictEqual({
				[processKind.runTimeKey]: null,
				definition: {
					hooks: [],
					options: undefined,
					steps: [],
				},
			});

		type Check = ExpectType<
			typeof processBuilder,
			Process<
				{
					readonly steps: readonly [];
					readonly options: undefined;
					readonly hooks: readonly [];
				}
			>,
			"strict"
		>;
	});

	it("export one value", () => {
		const processBuilder = useProcessBuilder()
			.extract({
				query: DPE.number(),
				body: DPE.string(),
			})
			.exports(["body"]);

		expect({ ...processBuilder })
			.toStrictEqual({
				[processKind.runTimeKey]: null,
				definition: {
					hooks: [],
					options: undefined,
					steps: [
						{
							[extractStepKind.runTimeKey]: null,
							[stepKind.runTimeKey]: null,
							definition: {
								responseContract: undefined,
								shape: {
									query: expect.objectContaining({
										[DP.numberKind.runTimeKey]: null,
									}),
									body: expect.objectContaining({
										[DP.stringKind.runTimeKey]: null,
									}),
								},
							},
						},
					],
				},
			});

		type Check = ExpectType<
			typeof processBuilder,
			Process<
				SimplifyTopLevel<
					& {
						readonly hooks: readonly [];
						readonly options: undefined;
						readonly steps: readonly [
							ExtractStep<{
								readonly shape: {
									query: DPE.DataParserNumberExtended<{
										readonly errorMessage?: string | undefined;
										readonly coerce: boolean;
										readonly checkers: readonly [];
									}>;
									body: DPE.DataParserStringExtended<{
										readonly errorMessage?: string | undefined;
										readonly coerce: boolean;
										readonly checkers: readonly [];
									}>;
								};
								readonly responseContract: undefined;
							}>,
						];
					}
					& ProcessExportValue<{ body: string }>
				>
			>,
			"strict"
		>;
	});

	it("export one value", () => {
		const processBuilder = useProcessBuilder()
			.extract({
				query: DPE.number(),
				body: DPE.string(),
			})
			.exports(["body", "query"]);

		expect({ ...processBuilder })
			.toStrictEqual({
				[processKind.runTimeKey]: null,
				definition: {
					hooks: [],
					options: undefined,
					steps: [
						{
							[extractStepKind.runTimeKey]: null,
							[stepKind.runTimeKey]: null,
							definition: {
								responseContract: undefined,
								shape: {
									query: expect.objectContaining({
										[DP.numberKind.runTimeKey]: null,
									}),
									body: expect.objectContaining({
										[DP.stringKind.runTimeKey]: null,
									}),
								},
							},
						},
					],
				},
			});

		type Check = ExpectType<
			typeof processBuilder,
			Process<
				SimplifyTopLevel<
					& {
						readonly hooks: readonly [];
						readonly options: undefined;
						readonly steps: readonly [
							ExtractStep<{
								readonly shape: {
									query: DPE.DataParserNumberExtended<{
										readonly errorMessage?: string | undefined;
										readonly coerce: boolean;
										readonly checkers: readonly [];
									}>;
									body: DPE.DataParserStringExtended<{
										readonly errorMessage?: string | undefined;
										readonly coerce: boolean;
										readonly checkers: readonly [];
									}>;
								};
								readonly responseContract: undefined;
							}>,
						];
					}
					& ProcessExportValue<{
						body: string;
						query: number;
					}>
				>
			>,
			"strict"
		>;
	});

	it("export with options and hook", () => {
		const processBuilder = useProcessBuilder({
			options: { test: true },
			hooks: [{ onConstructRequest: ({ addRequestProperties }) => addRequestProperties({ prop: 1 }) }],
		})
			.exports();

		expect({ ...processBuilder })
			.toStrictEqual({
				[processKind.runTimeKey]: null,
				definition: {
					hooks: [{ onConstructRequest: expect.any(Function) }],
					options: { test: true },
					steps: [],
				},
			});

		type Check = ExpectType<
			typeof processBuilder,
			Process<
				SimplifyTopLevel<
					& {
						readonly steps: readonly [];
						readonly options: {
							test: boolean;
						};
						readonly hooks: readonly [
							{
								// eslint-disable-next-line @typescript-eslint/method-signature-style
								readonly onConstructRequest: (params: HookParamsOnConstructRequest) => Request & {
									prop: number;
								};
							},
						];
					}
					& ProcessRequest<Request & { prop: number }>
				>
			>,
			"strict"
		>;
	});
});
