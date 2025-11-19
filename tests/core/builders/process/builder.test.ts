import { type Request, type HookParamsOnConstructRequest, useProcessBuilder, type ProcessBuilder } from "@core";
import { builderKind, type ExpectType } from "@duplojs/utils";

describe("process builder", () => {
	it("useProcessBuilder", () => {
		const processBuilder = useProcessBuilder();

		expect({ ...processBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					options: undefined,
					steps: [],
				},
			}),
		);

		type Check = ExpectType<
			typeof processBuilder,
			ProcessBuilder<
				{
					readonly steps: readonly [];
					readonly options: undefined;
					readonly hooks: readonly [];
				},
				{},
				Request
			>,
			"strict"
		>;
	});

	it("useProcessBuilder with options", () => {
		const processBuilder = useProcessBuilder({
			options: { test: true },
		});

		expect({ ...processBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					options: { test: true },
					steps: [],
				},
			}),
		);

		type Check = ExpectType<
			typeof processBuilder,
			ProcessBuilder<
				{
					readonly steps: readonly [];
					readonly options: {
						test: boolean;
					};
					readonly hooks: readonly [];
				},
				{ options: { test: boolean } },
				Request
			>,
			"strict"
		>;
	});

	it("useProcessBuilder with hook", () => {
		const routeBuilder = useProcessBuilder({
			hooks: [
				{ onConstructRequest: ({ addRequestProperties }) => addRequestProperties({ aa: 1 }) },
				{ onConstructRequest: ({ addRequestProperties }) => addRequestProperties({ bb: 1 }) },
			],
		});

		expect({ ...routeBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [
						{ onConstructRequest: expect.any(Function) },
						{ onConstructRequest: expect.any(Function) },
					],
					options: undefined,
					steps: [],
				},
			}),
		);

		type Check = ExpectType<
			typeof routeBuilder,
			ProcessBuilder<
				{
					readonly steps: readonly [];
					readonly options: undefined;
					readonly hooks: readonly [
						{
							// eslint-disable-next-line @typescript-eslint/method-signature-style
							readonly onConstructRequest: (params: HookParamsOnConstructRequest) => Request & {
								aa: number;
							};
						},
						{
							// eslint-disable-next-line @typescript-eslint/method-signature-style
							readonly onConstructRequest: (params: HookParamsOnConstructRequest) => Request & {
								bb: number;
							};
						},
					];
				},
				{},
				& Request
				& { aa: number }
				& { bb: number }
			>,
			"strict"
		>;
	});
});
