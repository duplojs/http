import { type ExtractStep, extractStepKind, type HandlerStep, handlerStepKind, ResponseContract, type Route, routeKind, stepKind, useRouteBuilder, type Response, type HandlerStepFunctionParams, type Request, type HookParamsOnConstructRequest } from "@core";
import { type DP, DPE, type ExpectType } from "@duplojs/utils";
import { type MaybePromise } from "rollup";

describe("route builder handler method", () => {
	it("handler", () => {
		const routeBuilder = useRouteBuilder("GET", "/test")
			.extract({ body: DPE.string() })
			.handler(
				ResponseContract.ok("test", DPE.string()),
				(floor, { response }) => {
					type Check = ExpectType<
						typeof floor,
						{ body: string },
						"strict"
					>;

					return response("test", "toto");
				},
			);

		expect({ ...routeBuilder }).toStrictEqual({
			[routeKind.runTimeKey]: null,
			definition: {
				hooks: [],
				method: "GET",
				paths: ["/test"],
				preflightSteps: [],
				steps: [
					expect.objectContaining({
						[extractStepKind.runTimeKey]: null,
					}),
					{
						[handlerStepKind.runTimeKey]: null,
						[stepKind.runTimeKey]: null,
						definition: {
							theFunction: expect.any(Function),
							responseContract: expect.objectContaining({
								[ResponseContract.contractKind.runTimeKey]: null,
								code: "200",
							}),
						},
					},
				],
			},
		});

		type Check = ExpectType<
			typeof routeBuilder,
			Route<
				{
					readonly method: "GET";
					readonly paths: readonly ["/test"];
					readonly preflightSteps: readonly [];
					readonly hooks: readonly [];
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
						HandlerStep<{
							readonly responseContract: ResponseContract.Contract<
								"200",
								"test",
								DPE.DataParserStringExtended<{
									readonly errorMessage?: string | undefined;
									readonly coerce: boolean;
									readonly checkers: readonly [];
								}>
							>;
							theFunction(
								floor: { body: string },
								param: HandlerStepFunctionParams<
									Request,
									Response<"200", "test", string>
								>
							): MaybePromise<Response<"200", "test", string>>;
						}>,
					];
				}
			>,
			"strict"
		>;
	});

	it("handler with multi contract", () => {
		const routeBuilder = useRouteBuilder("GET", "/test")
			.handler(
				[ResponseContract.ok("test", DPE.string()), ResponseContract.noContent("toto")],
				(floor, { response }) => true.valueOf() ? response("test", "toto") : response("toto"),
			);

		expect({ ...routeBuilder }).toStrictEqual({
			[routeKind.runTimeKey]: null,
			definition: {
				hooks: [],
				method: "GET",
				paths: ["/test"],
				preflightSteps: [],
				steps: [
					{
						[handlerStepKind.runTimeKey]: null,
						[stepKind.runTimeKey]: null,
						definition: {
							theFunction: expect.any(Function),
							responseContract: [
								expect.objectContaining({
									[ResponseContract.contractKind.runTimeKey]: null,
									code: "200",
								}),
								expect.objectContaining({
									[ResponseContract.contractKind.runTimeKey]: null,
									code: "204",
								}),
							],
						},
					},
				],
			},
		});

		type Check = ExpectType<
			typeof routeBuilder,
			Route<
				{
					readonly method: "GET";
					readonly paths: readonly ["/test"];
					readonly preflightSteps: readonly [];
					readonly hooks: readonly [];
					readonly steps: readonly [
						HandlerStep<{
							readonly responseContract: [
								ResponseContract.Contract<
									"200",
									"test",
									DPE.DataParserStringExtended<{
										readonly errorMessage?: string | undefined;
										readonly coerce: boolean;
										readonly checkers: readonly [];
									}>
								>,
								ResponseContract.Contract<
									"204",
									"toto",
									DP.DataParserEmpty
								>,
							];
							theFunction(
								floor: {},
								param: HandlerStepFunctionParams<
									Request,
									| Response<"200", "test", string>
									| Response<"204", "toto", undefined>
								>
							): MaybePromise<
								| Response<"200", "test", string>
								| Response<"204", "toto", undefined>
							>;
						}>,
					];
				}
			>,
			"strict"
		>;
	});

	it("handler with hooks", () => {
		const routeBuilder = useRouteBuilder("GET", "/test", {
			hooks: [{ onConstructRequest: ({ addRequestProperties }) => addRequestProperties({ prop: 1 }) }],
		})
			.handler(
				ResponseContract.noContent("toto"),
				(floor, { response, request }) => {
					type Check = ExpectType<
						typeof request,
						Request & {
							prop: number;
						},
						"strict"
					>;

					return response("toto");
				},
			);

		expect({ ...routeBuilder }).toStrictEqual({
			[routeKind.runTimeKey]: null,
			definition: {
				hooks: [{ onConstructRequest: expect.any(Function) }],
				method: "GET",
				paths: ["/test"],
				preflightSteps: [],
				steps: [
					{
						[handlerStepKind.runTimeKey]: null,
						[stepKind.runTimeKey]: null,
						definition: {
							theFunction: expect.any(Function),
							responseContract: expect.objectContaining({
								[ResponseContract.contractKind.runTimeKey]: null,
								code: "204",
							}),
						},
					},
				],
			},
		});

		type Check = ExpectType<
			typeof routeBuilder,
			Route<
				{
					readonly method: "GET";
					readonly paths: readonly ["/test"];
					readonly preflightSteps: readonly [];
					readonly hooks: readonly [
						{
							// eslint-disable-next-line @typescript-eslint/method-signature-style
							readonly onConstructRequest: (params: HookParamsOnConstructRequest) => Request & {
								prop: number;
							};
						},
					];
					readonly steps: readonly [
						HandlerStep<{
							readonly responseContract: ResponseContract.Contract<
								"204",
								"toto",
								DP.DataParserEmpty
							>;
							theFunction(
								floor: {},
								param: HandlerStepFunctionParams<
									Request & {
										prop: number;
									},
									Response<"204", "toto", undefined>
								>
							): MaybePromise<Response<"204", "toto", undefined>>;
						}>,
					];
				}
			>,
			"strict"
		>;
	});
});
