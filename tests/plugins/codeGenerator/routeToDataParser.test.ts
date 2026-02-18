import { controlBodyAsFormData, defaultExtractContract, ResponseContract, useProcessBuilder, useRouteBuilder } from "@core";
import { DP, DPE, E } from "@duplojs/utils";
import { testPresetChecker } from "@test-utils/presetChecker";
import { omitFunctions } from "@test-utils/omitFunction";
import { bodyAsFormData, convertRoutePath, IgnoreByCodeGeneratorMetadata, routeToDataParser } from "@plugin-codeGenerator";
import { SDPE } from "@duplojs/server-utils";
import { defaultTransformers, render } from "@duplojs/data-parser-tools/toTypescript";
import { fileTransformer } from "@plugin-codeGenerator/typescriptTransfomer";

describe("routeToDataParser", () => {
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

	it("expect good result", () => {
		const result = routeToDataParser(route, { defaultExtractContract });

		expect(omitFunctions(result)).toStrictEqual([
			omitFunctions(
				DP.object({
					method: DP.literal("GET"),
					path: DP.literal("/test"),
					body: DP.object({
						prop1: DPE.string(),
						prop2: DPE.number(),
					}),
					headers: DP.object({
						header3: DPE.string(),
						header4: DPE.number(),
						header1: DPE.string(),
						header2: DPE.number(),
					}),
					query: DPE.string(),
					responses: DP.union([
						DP.object({
							code: DP.literal(defaultExtractContract.code),
							information: DP.literal(defaultExtractContract.information),
							body: DP.empty(),
						}),
						DP.object({
							code: DP.literal("404"),
							information: DP.literal("notFound"),
							body: DP.empty(),
						}),
						DP.object({
							code: DP.literal("204"),
							information: DP.literal("test"),
							body: DP.empty(),
						}),
						DP.object({
							code: DP.literal(defaultExtractContract.code),
							information: DP.literal(defaultExtractContract.information),
							body: DP.empty(),
						}),
						DP.object({
							code: DP.literal(defaultExtractContract.code),
							information: DP.literal(defaultExtractContract.information),
							body: DP.empty(),
						}),
					]),
				}),
			),
		]);
	});

	it("ignored route", () => {
		const route = useRouteBuilder("GET", "/test", { metadata: [IgnoreByCodeGeneratorMetadata()] })
			.handler(
				ResponseContract.noContent("test"),
				(__, { response }) => response("test"),
			);

		const result = routeToDataParser(
			route,
			{ defaultExtractContract },
		);

		expect(result).toStrictEqual([]);
	});

	it("convertRoutePath", () => {
		expect(
			omitFunctions(
				[
					convertRoutePath("/test/*"),
					convertRoutePath("/test"),
					convertRoutePath("/test-*/ok"),
				],
			),
		).toStrictEqual(
			omitFunctions([
				DP.templateLiteral(["/test/", DP.string(), ""]),
				DP.literal("/test"),
				DP.templateLiteral(["/test-", DP.string(), "/ok"]),
			]),
		);
	});

	it("", () => {
		const route = useRouteBuilder("GET", "/test", { bodyController: controlBodyAsFormData({ maxFileQuantity: 1 }) })
			.extract({
				body: DP.object({
					test: DP.string(),
				}),
			})
			.handler(
				ResponseContract.noContent("test"),
				(__, { response }) => response("test"),
			);

		const result = routeToDataParser(
			route,
			{ defaultExtractContract },
		);

		expect(
			(result as any)[0]?.definition.shape.body.definition.overrideTypescriptTransformer,
		).toStrictEqual(bodyAsFormData);
	});

	it("bodyAsFormData", () => {
		expect(
			render(
				DPE.array(SDPE.file()).addOverrideTypescriptTransformer(bodyAsFormData),
				{
					identifier: "ArrayString",
					transformers: [fileTransformer, ...defaultTransformers],
					mode: "out",
				},
			),
		).toMatchSnapshot();

		expect(
			bodyAsFormData(SDPE.file(), { transformer: () => E.left("test") } as never),
		).toStrictEqual(E.left("test"));
	});
});
