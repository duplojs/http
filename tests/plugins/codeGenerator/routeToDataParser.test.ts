import { defaultExtractContract, ResponseContract, useProcessBuilder, useRouteBuilder } from "@core";
import { DP, DPE } from "@duplojs/utils";
import { testPresetChecker } from "@test-utils/presetChecker";
import { omitFunctions } from "@test-utils/omitFunction";
import { responseCodeDataParser, responseCodeDataParsers, routeToDataParser } from "@plugin-codeGenerator";

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

		expect(omitFunctions(result)).toStrictEqual(
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
							code: responseCodeDataParser,
							information: DP.string(),
							body: DP.unknown(),
							fromHook: DP.literal(true),
						}),
						DP.object({
							code: responseCodeDataParsers.serverError,
							information: DP.string(),
							body: DP.unknown(),
						}),
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
		);
	});
});
