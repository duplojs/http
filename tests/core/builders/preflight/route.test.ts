import { type RouteBuilder, usePreflightBuilder, useProcessBuilder, type ProcessStep, processStepKind, stepKind, IgnoreByRouteStoreMetadata, type Metadata, type RouteHookParamsAfter, type RouteHookNext } from "@core";
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
				{}
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
				{}
			>,
			"strict"
		>;
	});

	it("useRouteBuilder with hook", () => {
		const routeBuilder = usePreflightBuilder()
			.useRouteBuilder("GET", "/test", {
				hooks: [
					{ afterSendResponse: ({ next }) => next() },
					{ afterSendResponse: ({ next }) => next() },
				],
			});

		expect({ ...routeBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [
						{ afterSendResponse: expect.any(Function) },
						{ afterSendResponse: expect.any(Function) },
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
							readonly afterSendResponse: (param: RouteHookParamsAfter) => RouteHookNext;
						},
						{
							// eslint-disable-next-line @typescript-eslint/method-signature-style
							readonly afterSendResponse: (param: RouteHookParamsAfter) => RouteHookNext;
						},
					];
					readonly metadata: readonly [];
				},
				{}
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
				{ body: string }
			>,
			"strict"
		>;
	});

	it("useRouteBuilder with hooks on preflight builder", () => {
		const routeBuilder = usePreflightBuilder({
			hooks: [
				{ afterSendResponse: ({ next }) => next() },
				{ afterSendResponse: ({ next }) => next() },
			],
		})
			.useRouteBuilder("GET", "/toto");

		expect({ ...routeBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [
						{ afterSendResponse: expect.any(Function) },
						{ afterSendResponse: expect.any(Function) },
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
							readonly afterSendResponse: (param: RouteHookParamsAfter) => RouteHookNext;
						},
						{
							// eslint-disable-next-line @typescript-eslint/method-signature-style
							readonly afterSendResponse: (param: RouteHookParamsAfter) => RouteHookNext;
						},
					];
					readonly metadata: readonly [];
				},
				{ }
			>,
			"strict"
		>;
	});
});
