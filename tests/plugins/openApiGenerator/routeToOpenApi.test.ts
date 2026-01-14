import { defaultExtractContract, ResponseContract, useProcessBuilder, useRouteBuilder } from "@core";
import { DP, DPE } from "@duplojs/utils";
import { testPresetChecker } from "@test-utils/presetChecker";
import { omitFunctions } from "@test-utils/omitFunction";
import { routeToOpenApi } from "@plugin-openApiGenerator";

describe("routeToOpenApi", () => {
	it("empty result", () => {
		const process1 = useProcessBuilder()
			.extract({
				headers: {
					header1: DPE.string(),
					header2: DPE.number(),
				},
				body: DPE.string(),
			})
			.exports();

		const process2 = useProcessBuilder()
			.extract({})
			.exports();

		const route = useRouteBuilder("GET", "/test")
			.extract({
				headers: DPE.object({
					header3: DPE.string(),
					header4: DPE.number(),
				}),
				body: {
					prop1: DPE.string(),
					prop2: DPE.number(),
				},
				query: DPE.string(),
			})
			.exec(process1)
			.exec(process2)
			.presetCheck(testPresetChecker, () => "")
			.handler(
				ResponseContract.noContent("test"),
				(__, { response }) => response("test"),
			);

		const result = routeToOpenApi(
			route,
			{
				defaultExtractContract,
				contextToJsonSchemaFactory: new Map(),
				resultSchemaContext: new Map(),
			},
		);

		expect(omitFunctions(result)).toStrictEqual(
			[
				{
					path: "/test",
					method: "get",
					parameters: [
						{
							name: "header3",
							in: "header",
							required: true,
							schema: { $ref: "#/components/schemas/NotIdentified0" },
						},
						{
							name: "header4",
							in: "header",
							required: true,
							schema: { $ref: "#/components/schemas/NotIdentified1" },
						},
						{
							name: "header1",
							in: "header",
							required: true,
							schema: { $ref: "#/components/schemas/NotIdentified2" },
						},
						{
							name: "header2",
							in: "header",
							required: true,
							schema: { $ref: "#/components/schemas/NotIdentified3" },
						},
					],
					requestBody: {
						required: true,
						content: {
							"application/json": { $ref: "#/components/schemas/NotIdentified4" },
						},
					},
					responses: {
						204: {
							headers: {
								information: {
									schema: {
										const: "test",
										type: "string",
									},
								},
							},
						},
						404: {
							headers: {
								information: {
									schema: {
										const: "notFound",
										type: "string",
									},
								},
							},
						},
						422: {
							headers: {
								information: {
									schema: {
										anyOf: [
											{
												anyOf: [
													{
														const: "extract-error",
														type: "string",
													},
													{
														const: "extract-error",
														type: "string",
													},
												],
											},
											{
												const: "extract-error",
												type: "string",
											},
										],
									},
								},
							},
						},
					},
				},
			],
		);
	});

	it("text/plain", () => {
		const route = useRouteBuilder("GET", "/test")
			.cut(
				ResponseContract.ok("cut", DP.string()),
				(__, { output, response }) => {
					if (Date.now() > 4) {
						return response("cut", "cut");
					}

					return output();
				},
			)
			.handler(
				ResponseContract.ok("handler", DP.string()),
				(__, { response }) => response("handler", "handler"),
			);

		const result = routeToOpenApi(
			route,
			{
				defaultExtractContract,
				contextToJsonSchemaFactory: new Map(),
				resultSchemaContext: new Map(),
			},
		);

		expect(result).toStrictEqual(
			[
				{
					path: "/test",
					method: "get",
					parameters: [],
					requestBody: undefined,
					responses: {
						200: {
							headers: {
								information: {
									schema: {
										anyOf: [
											{
												const: "cut",
												type: "string",
											},
											{
												const: "handler",
												type: "string",
											},
										],
									},
								},
							},
							content: {
								"plain/text": { schema: { $ref: "#/components/schemas/NotIdentified0" } },
							},
						},
					},
				},
			],
		);
	});

	it("application/json", () => {
		const cutStepSchema = DP.object({
			toto: DP.string(),
		});
		const handlerStepSchema = DP.object({
			test: DP.literal("test"),
		});

		const route = useRouteBuilder("GET", "/test")
			.cut(
				ResponseContract.ok("cut", cutStepSchema),
				(__, { output, response }) => {
					if (Date.now() > 4) {
						return response("cut", { toto: "tr" });
					}

					return output();
				},
			)
			.handler(
				ResponseContract.ok("handler", handlerStepSchema),
				(__, { response }) => response("handler", { test: "test" }),
			);

		const result = routeToOpenApi(
			route,
			{
				defaultExtractContract,
				contextToJsonSchemaFactory: new Map(),
				resultSchemaContext: new Map(),
			},
		);

		expect(result).toStrictEqual(
			[
				{
					path: "/test",
					method: "get",
					parameters: [],
					requestBody: undefined,
					responses: {
						200: {
							headers: {
								information: {
									schema: {
										anyOf: [
											{
												const: "cut",
												type: "string",
											},
											{
												const: "handler",
												type: "string",
											},
										],
									},
								},
							},
							content: {
								"application/json": {
									schema: {
										anyOf: [
											{ $ref: "#/components/schemas/NotIdentified0" },
											{ $ref: "#/components/schemas/NotIdentified1" },
										],
									},
								},
							},
						},
					},
				},
			],
		);
	});
});
