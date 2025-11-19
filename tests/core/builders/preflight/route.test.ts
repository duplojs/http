import { type RouteBuilder, usePreflightBuilder, type Request, type HookParamsOnConstructRequest, useProcessBuilder, type ProcessStep, processStepKind, stepKind } from "@core";
import { builderKind, DPE, type ExpectType } from "@duplojs/utils";

describe("preflight builder use route builder", () => {
	it("useRouteBuilder", () => {
		const routeBuilder = usePreflightBuilder()
			.useRouteBuilder("GET", "/test");

		expect({ ...routeBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					method: "GET",
					paths: ["/test"],
					preflightSteps: [],
					steps: [],
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
					readonly steps: readonly [];
					readonly hooks: readonly [];
				},
				{},
				Request
			>,
			"strict"
		>;
	});

	it("useRouteBuilder with multi path", () => {
		const routeBuilder = usePreflightBuilder()
			.useRouteBuilder("GET", ["/test", "/toto"]);

		expect({ ...routeBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					method: "GET",
					paths: ["/test", "/toto"],
					preflightSteps: [],
					steps: [],
				},
			}),
		);

		type Check = ExpectType<
			typeof routeBuilder,
			RouteBuilder<
				{
					readonly method: "GET";
					readonly paths: readonly ["/test", "/toto"];
					readonly preflightSteps: readonly [];
					readonly steps: readonly [];
					readonly hooks: readonly [];
				},
				{},
				Request
			>,
			"strict"
		>;
	});

	it("useRouteBuilder with hook", () => {
		const routeBuilder = usePreflightBuilder()
			.useRouteBuilder("GET", "/test", {
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
					method: "GET",
					paths: ["/test"],
					preflightSteps: [],
					steps: [],
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
					readonly steps: readonly [];
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

	it("useRouteBuilder with preflight", () => {
		const process = useProcessBuilder()
			.extract({
				query: DPE.number(),
				body: DPE.string(),
			})
			.exports(["body", "query"]);

		const routeBuilder = usePreflightBuilder()
			.exec(process, { imports: ["body"] })
			.useRouteBuilder("GET", "/toto");

		expect({ ...routeBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					method: "GET",
					paths: ["/toto"],
					preflightSteps: [
						{
							[processStepKind.runTimeKey]: null,
							[stepKind.runTimeKey]: null,
							definition: {
								process: process,
								imports: ["body"],
							},
						},
					],
					steps: [],
				},
			}),
		);

		type Check = ExpectType<
			typeof routeBuilder,
			RouteBuilder<
				{
					readonly method: "GET";
					readonly paths: readonly ["/toto"];
					readonly preflightSteps: readonly [
						ProcessStep<{
							readonly process: typeof process;
							readonly options: undefined;
							readonly imports: readonly ["body"];
						}>,
					];
					readonly steps: readonly [];
					readonly hooks: readonly [];
				},
				{ body: string },
				Request
			>,
			"strict"
		>;
	});

	it("useRouteBuilder with hooks on preflight builder", () => {
		const routeBuilder = usePreflightBuilder({
			hooks: [
				{ onConstructRequest: ({ addRequestProperties }) => addRequestProperties({ aa: 1 }) },
				{ onConstructRequest: ({ addRequestProperties }) => addRequestProperties({ bb: 1 }) },
			],
		})
			.useRouteBuilder("GET", "/toto");

		expect({ ...routeBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [
						{ onConstructRequest: expect.any(Function) },
						{ onConstructRequest: expect.any(Function) },
					],
					method: "GET",
					paths: ["/toto"],
					preflightSteps: [],
					steps: [],
				},
			}),
		);

		type Check = ExpectType<
			typeof routeBuilder,
			RouteBuilder<
				{
					readonly method: "GET";
					readonly paths: readonly ["/toto"];
					readonly preflightSteps: readonly [];
					readonly steps: readonly [];
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
				{ },
				& Request
				& { aa: number }
				& { bb: number }
			>,
			"strict"
		>;
	});
});
