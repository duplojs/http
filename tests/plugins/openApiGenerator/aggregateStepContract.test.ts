import { defaultExtractContract, ResponseContract, useProcessBuilder, useRouteBuilder } from "@core";
import { DP, DPE } from "@duplojs/utils";
import { aggregateStepContract, IgnoreRouteByOpenApiGeneratorMetadata } from "@plugin-openApiGenerator";
import { testPresetChecker } from "@test-utils/presetChecker";
import { omitFunctions } from "@test-utils/omitFunction";

describe("aggregateStepContract", () => {
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
		metadata: [IgnoreRouteByOpenApiGeneratorMetadata()],
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
			IgnoreRouteByOpenApiGeneratorMetadata(),
		)
		.exec(process1)
		.exec(process2)
		.exec(ignoredProcess)
		.presetCheck(testPresetChecker, () => "")
		.handler(
			ResponseContract.noContent("test"),
			(__, { response }) => response("test"),
		);

	it("generate entrypoint schema and aggregate endpoint", () => {
		const result = aggregateStepContract(route.definition.steps, { defaultExtractContract });

		expect(omitFunctions(result)).toStrictEqual(
			omitFunctions({
				endpointContract: [
					ResponseContract.unprocessableContent(defaultExtractContract.information),
					ResponseContract.notFound("notFound"),
					ResponseContract.noContent("test"),
					ResponseContract.unprocessableContent(defaultExtractContract.information),
					ResponseContract.unprocessableContent(defaultExtractContract.information),
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
