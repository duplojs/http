import { createPresetChecker, ResponseContract, useProcessBuilder, useRouteBuilder } from "@core";
import { DPE } from "@duplojs/utils";
import { findIdentifiedDataParserInSteps } from "@plugin-codeGenerator/findIdentifiedDataParserInSteps";
import { testChecker } from "@test-utils/checker";

describe("findIdentifiedDataParserInSteps", () => {
	it("finds only identified data parsers from extract steps", () => {
		const dataParser1 = DPE.string().setIdentifier("extractNested");
		const dataParser2 = DPE.string().setIdentifier("extractHeader");
		const dataParser3 = DPE.string().setIdentifier("extractQuery");

		const extractBody = DPE.object({
			nested: dataParser1,
			ignored: DPE.number(),
		});

		const route = useRouteBuilder("GET", "/test")
			.extract({
				body: extractBody,
				headers: dataParser2,
				query: {
					search: dataParser3,
					page: DPE.number(),
				},
			})
			.handler(
				ResponseContract.noContent("extract.ok"),
				(__, { response }) => response("extract.ok"),
			);

		const result = findIdentifiedDataParserInSteps(
			route.definition.steps,
			{ ignoreDataParser: new Set() },
		);

		expect(result).toStrictEqual([
			dataParser1,
			dataParser2,
			dataParser3,
		]);
	});

	it("finds only identified data parsers from step response contracts", () => {
		const presetBody = DPE.string().setIdentifier("presetBody");

		const presetChecker = createPresetChecker(
			testChecker,
			{
				result: "info",
				otherwise: ResponseContract.badRequest("preset.invalid", presetBody),
			},
		);

		const dataParser1 = DPE.empty().setIdentifier("checkerBody");
		const dataParser2 = DPE.string().setIdentifier("cutBody");
		const dataParser3 = DPE.string().setIdentifier("handlerBody");

		const route = useRouteBuilder("GET", "/test")
			.extract({ body: DPE.string() })
			.check(
				testChecker,
				{
					input: () => "",
					result: "info",
					otherwise: ResponseContract.badRequest(
						"checker.invalid",
						dataParser1,
					),
				},
			)
			.cut(
				ResponseContract.conflict("cut.conflict", dataParser2),
				(__, { response }) => response("cut.conflict", ""),
			)
			.presetCheck(presetChecker, () => "")
			.handler(
				ResponseContract.ok(
					"handler.ok",
					DPE.object({
						kept: dataParser3,
						ignored: DPE.number(),
					}),
				),
				(__, { response }) => response("handler.ok", {
					kept: "",
					ignored: 1,
				}),
			);

		const result = findIdentifiedDataParserInSteps(
			route.definition.steps,
			{ ignoreDataParser: new Set() },
		);

		expect(result).toStrictEqual([
			dataParser1,
			dataParser2,
			presetBody,
			dataParser3,
		]);
	});

	it("walks nested process steps and ignores already visited data parsers", () => {
		const sharedDataParser = DPE.string().setIdentifier("sharedDataParser");

		const process = useProcessBuilder()
			.extract({ body: sharedDataParser })
			.cut(
				ResponseContract.conflict("process.conflict", sharedDataParser),
				(__, { response }) => response("process.conflict", ""),
			)
			.exports();

		const route = useRouteBuilder("GET", "/test")
			.exec(process)
			.handler(
				ResponseContract.ok("route.ok", sharedDataParser),
				(__, { response }) => response("route.ok", ""),
			);

		const result = findIdentifiedDataParserInSteps(
			route.definition.steps,
			{ ignoreDataParser: new Set() },
		);

		expect(result).toStrictEqual([sharedDataParser]);
	});
});
