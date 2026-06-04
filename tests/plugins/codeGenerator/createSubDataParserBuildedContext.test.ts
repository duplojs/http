import { A, DP } from "@duplojs/utils";
import { type DataParserToDataParser } from "@duplojs/data-parser-tools";
import { createSubDataParserBuildedContext } from "@plugin-codeGenerator/createSubDataParserBuildedContext";
import { factory } from "typescript";

describe("createSubDataParserBuildedContext", () => {
	it("creates one isolated sub-context per data parser with inherited imports and relative dependencies", () => {
		const dependencyDataParser = DP.string();
		const mainDataParser = DP.object({
			value: DP.number(),
		});

		const buildedContext: DataParserToDataParser.BuildedContext = {
			context: new Map([
				[
					mainDataParser as never,
					{
						identifier: factory.createIdentifier("MainParser"),
						expression: factory.createIdentifier("mainExpression"),
						typeIdentifier: factory.createIdentifier("MainType"),
						dependencies: new Set([dependencyDataParser, DP.empty()]),
					},
				],
				[
					dependencyDataParser as never,
					{
						identifier: factory.createIdentifier("DependencyParser"),
						expression: factory.createIdentifier("dependencyExpression"),
						typeIdentifier: null,
						dependencies: new Set(),
					},
				],
			]),
			importContext: new Map([
				[
					"@duplojs/utils/dataParser",
					{
						namespace: ["DP"],
					},
				],
				[
					"shared-package",
					{
						direct: ["SharedType"],
					},
				],
			]),
			typescriptContext: new Map(),
			importMode: "lite",
		};

		const result = A.from(createSubDataParserBuildedContext(buildedContext));
		const mainSubContext = result.find((context) => context.identifier === "MainParser");
		const dependencySubContext = result.find((context) => context.identifier === "DependencyParser");

		expect(result).toHaveLength(2);
		expect(mainSubContext).toBeDefined();
		expect(dependencySubContext).toBeDefined();

		expect({
			identifier: mainSubContext!.identifier,
			context: A.from(mainSubContext!.context.entries()),
			importContext: A.from(mainSubContext!.importContext.entries()),
			typescriptContext: A.from(mainSubContext!.typescriptContext.entries()),
			importMode: mainSubContext!.importMode,
		}).toStrictEqual({
			identifier: "MainParser",
			context: [
				[
					mainDataParser,
					buildedContext.context.get(mainDataParser as never),
				],
			],
			importContext: [
				[
					"@duplojs/utils/dataParser",
					{
						namespace: ["DP"],
					},
				],
				[
					"shared-package",
					{
						direct: ["SharedType"],
					},
				],
				[
					"./DependencyParser",
					{
						direct: ["DependencyParser"],
					},
				],
				[
					"./types",
					{
						direct: ["MainType"],
					},
				],
			],
			typescriptContext: [],
			importMode: "lite",
		});

		expect({
			identifier: dependencySubContext!.identifier,
			context: A.from(dependencySubContext!.context.entries()),
			importContext: A.from(dependencySubContext!.importContext.entries()),
			typescriptContext: A.from(dependencySubContext!.typescriptContext.entries()),
			importMode: dependencySubContext!.importMode,
		}).toStrictEqual({
			identifier: "DependencyParser",
			context: [
				[
					dependencyDataParser,
					buildedContext.context.get(dependencyDataParser as never),
				],
			],
			importContext: [
				[
					"@duplojs/utils/dataParser",
					{
						namespace: ["DP"],
					},
				],
				[
					"shared-package",
					{
						direct: ["SharedType"],
					},
				],
			],
			typescriptContext: [],
			importMode: "lite",
		});
	});
});
