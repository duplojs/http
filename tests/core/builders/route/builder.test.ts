import { type RouteBuilder, useRouteBuilder, type Request, type HookParamsOnConstructRequest } from "@core";
import { builderKind, type ExpectType } from "@duplojs/utils";
import { blob } from "stream/consumers";

describe("route builder", () => {
	it("useRouteBuilder", () => {
		const routeBuilder = useRouteBuilder("GET", "/test");

		expect({ ...routeBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					method: "GET",
					paths: ["/test"],
					preFlightsStep: [],
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
					readonly preFlightsStep: readonly [];
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
		const routeBuilder = useRouteBuilder("GET", ["/test", "/toto"]);

		expect({ ...routeBuilder }).toStrictEqual(
			expect.objectContaining({
				[builderKind.runTimeKey]: {
					hooks: [],
					method: "GET",
					paths: ["/test", "/toto"],
					preFlightsStep: [],
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
					readonly preFlightsStep: readonly [];
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
		const routeBuilder = useRouteBuilder("GET", "/test", {
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
					preFlightsStep: [],
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
					readonly preFlightsStep: readonly [];
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
});
