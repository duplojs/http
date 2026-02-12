import { type RouteBuilder, usePreflightBuilder, type Request, type HookParamsOnConstructRequest, useProcessBuilder, type ProcessStep, processStepKind, stepKind, IgnoreByRouteStoreMetadata, type Metadata } from "@core";
import { builderKind, DPE, type ExpectType } from "@duplojs/utils";

describe("preflight builder use route builder", () => {
	it("useRouteBuilder", () => {
		const routeBuilder = usePreflightBuilder({ metadata: [IgnoreByRouteStoreMetadata()] })
			.useRouteBuilder("GET", "/test", { metadata: [IgnoreByRouteStoreMetadata()] });

		expect({ ...routeBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					method: "GET",
					paths: ["/test"],
					preflightSteps: [],
					bodyController: null,
					metadata: [IgnoreByRouteStoreMetadata(), IgnoreByRouteStoreMetadata()],
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
					readonly bodyController: null;
					readonly steps: readonly [];
					readonly hooks: readonly [];
					readonly metadata: readonly [
						Metadata<"ignore-by-route-store", unknown>,
						Metadata<"ignore-by-route-store", unknown>,
					];
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
					metadata: [],
					bodyController: null,
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
					readonly bodyController: null;
					readonly hooks: readonly [];
					readonly metadata: readonly [];
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
					bodyController: null,
					metadata: [],
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
					readonly bodyController: null;
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
					readonly metadata: readonly [];
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
					bodyController: null,
					paths: ["/toto"],
					preflightSteps: [
						{
							[processStepKind.runTimeKey]: null,
							[stepKind.runTimeKey]: null,
							definition: {
								process: process,
								imports: ["body"],
								metadata: [],
							},
						},
					],
					metadata: [],
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
					readonly bodyController: null;
					readonly preflightSteps: readonly [
						ProcessStep<{
							readonly process: typeof process;
							readonly options: undefined;
							readonly imports: readonly ["body"];
							readonly metadata: readonly [];
						}>,
					];
					readonly metadata: readonly [];
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
					bodyController: null,
					paths: ["/toto"],
					preflightSteps: [],
					metadata: [],
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
					readonly bodyController: null;
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
					readonly metadata: readonly [];
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
