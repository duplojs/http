
import { type RouteBuilder, useRouteBuilder, type Request, type Metadata, IgnoreByRouteStoreMetadata, controlBodyAsFormData, type BodyController, type FormDataBodyReaderParams, createHookRouteLifeCycle, type RouteHookParamsAfter, type RouteHookNext } from "@core";
import { builderKind, type ExpectType } from "@duplojs/utils";

describe("route builder", () => {
	it("useRouteBuilder", () => {
		const routeBuilder = useRouteBuilder("GET", "/test", { metadata: [IgnoreByRouteStoreMetadata()] });

		expect({ ...routeBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					method: "GET",
					paths: ["/test"],
					preflightSteps: [],
					steps: [],
					metadata: [IgnoreByRouteStoreMetadata()],
					bodyController: null,
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
					readonly metadata: readonly [Metadata<"ignore-by-route-store", unknown>];
					readonly bodyController: null;
				},
				{}
			>,
			"strict"
		>;
	});

	it("useRouteBuilder with multi path", () => {
		const routeBuilder = useRouteBuilder("GET", ["/test", "/toto"]);

		expect({ ...routeBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					method: "GET",
					paths: ["/test", "/toto"],
					preflightSteps: [],
					steps: [],
					metadata: [],
					bodyController: null,
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
					readonly metadata: readonly [];
					readonly bodyController: null;
				},
				{}
			>,
			"strict"
		>;
	});

	it("useRouteBuilder with hook", () => {
		const routeBuilder = useRouteBuilder("GET", "/test", {
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
					steps: [],
					metadata: [],
					bodyController: null,
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
							readonly afterSendResponse: (param: RouteHookParamsAfter) => RouteHookNext;
						},
						{
							// eslint-disable-next-line @typescript-eslint/method-signature-style
							readonly afterSendResponse: (param: RouteHookParamsAfter) => RouteHookNext;
						},
					];
					readonly metadata: readonly [];
					readonly bodyController: null;
				},
				{}
			>,
			"strict"
		>;
	});

	it("useRouteBuilder with Custom bodyController", () => {
		const bodyController = controlBodyAsFormData({ maxFileQuantity: 10 });
		const routeBuilder = useRouteBuilder("GET", "/test", { bodyController });

		expect({ ...routeBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					method: "GET",
					paths: ["/test"],
					preflightSteps: [],
					steps: [],
					metadata: [],
					bodyController: bodyController,
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
					readonly metadata: readonly [];
					readonly bodyController: BodyController<"formData", FormDataBodyReaderParams>;
				},
				{}
			>,
			"strict"
		>;
	});
});
