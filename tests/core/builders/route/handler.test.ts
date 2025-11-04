import { type ExtractStep, extractStepKind, type HandlerStep, handlerStepKind, ResponseContract, type Route, routeKind, stepKind, useRouteBuilder, type Response, type HandlerStepFunctionParams, type Request } from "@core";
import { type DP, DPE, type ExpectType } from "@duplojs/utils";

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

		expect({ ...routeBuilder }).toStrictEqual(
			expect.objectContaining({
				[routeKind.runTimeKey]: null,
				definition: {
					hooks: [],
					method: "GET",
					paths: ["/test"],
					preFlightsStep: [],
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
			}),
		);

		type Check = ExpectType<
			typeof routeBuilder,
			Route<
				{
					readonly method: "GET";
					readonly paths: readonly ["/test"];
					readonly preFlightsStep: readonly [];
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
							): Response<"200", "test", string>;
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

		expect({ ...routeBuilder }).toStrictEqual(
			expect.objectContaining({
				[routeKind.runTimeKey]: null,
				definition: {
					hooks: [],
					method: "GET",
					paths: ["/test"],
					preFlightsStep: [],
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
			}),
		);

		type Check = ExpectType<
			typeof routeBuilder,
			Route<
				{
					readonly method: "GET";
					readonly paths: readonly ["/test"];
					readonly preFlightsStep: readonly [];
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
							):
								| Response<"200", "test", string>
								| Response<"204", "toto", undefined>;
						}>,
					];
				}
			>,
			"strict"
		>;
	});
});
