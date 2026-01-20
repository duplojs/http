import { defaultExtractContract, ResponseContract, useProcessBuilder, useRouteBuilder } from "@core";
import { DP, DPE } from "@duplojs/utils";
import { aggregateStepContract, IgnoreRouteByCodeGeneratorMetadata } from "@plugin-codeGenerator";
import { testPresetChecker } from "@test-utils/presetChecker";
import { omitFunctions } from "@test-utils/omitFunction";

describe("stepsToDataParser", () => {
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

	const ignoredProcess = useProcessBuilder({
		metadata: [IgnoreRouteByCodeGeneratorMetadata()],
	})
		.extract({ query: { ignoredQuery: DPE.string() } })
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
		})
		.extract(
			{
				params: {
					ignoredParams: DPE.string(),
				},
			},
			undefined,
			IgnoreRouteByCodeGeneratorMetadata(),
		)
		.exec(process1)
		.exec(process2)
		.exec(ignoredProcess)
		.presetCheck(testPresetChecker, () => "")
		.handler(
			ResponseContract.noContent("test"),
			(__, { response }) => response("test"),
		);

	it("generate endpoint and entrypoint schema", () => {
		const result = aggregateStepContract(route.definition.steps, { defaultExtractContract });

		expect(omitFunctions(result)).toStrictEqual(
			omitFunctions({
				endpointContract: [
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
				],
				entrypointContract: {
					headers: {
						header1: DPE.string(),
						header2: DPE.number(),
						header3: DPE.string(),
						header4: DPE.number(),
					},
					body: {
						prop1: DPE.string(),
						prop2: DPE.number(),
					},
					params: {},
					query: {},
				},

			}),
		);
	});
});
