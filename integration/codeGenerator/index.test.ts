import { hub } from "@core";
import { existsSync, readFileSync, rmSync } from "fs";
import { codeGeneratorPlugin } from "@duplojs/http/codeGenerator";
import { launchHookServer } from "@duplojs/http";
import { asyncPipe, E, Path } from "@duplojs/utils";
import { SF } from "@duplojs/server-utils";
import { assertTypeScriptProject } from "@utils";

describe("codeGenerator", () => {
	const fileName = `${import.meta.dirname}/type.generate.ts`;
	const folderName = `${import.meta.dirname}/dataParser.generate`;
	beforeAll(() => {
		if (existsSync(fileName)) {
			rmSync(fileName);
		}
		if (existsSync(folderName)) {
			rmSync(folderName, {
				recursive: true,
				force: true,
			});
		}
	});

	it("correct generate file", async() => {
		const hubWithPlugins = hub.plug(
			codeGeneratorPlugin({
				outputFile: fileName,
				generateDataParser: { outputFolder: folderName },
			}),
		);
		await launchHookServer(
			hubWithPlugins.aggregatesHooksHubLifeCycle("beforeStartServer"),
			hubWithPlugins,
			{} as any,
		);

		expect(readFileSync(fileName, "utf-8")).toMatchSnapshot();

		assertTypeScriptProject("codeGenerator/tsconfig.generatedDataParser.json");

		const result = await asyncPipe(
			{
				index: SF.readTextFile(Path.resolveRelative([folderName, "index.ts"])),
				types: SF.readTextFile(Path.resolveRelative([folderName, "types.ts"])),
				userDataParser: SF.readTextFile(Path.resolveRelative([folderName, "userDataParser.ts"])),
				userIdDataParser: SF.readTextFile(Path.resolveRelative([folderName, "userIdDataParser.ts"])),
				userNameDataParser: SF.readTextFile(Path.resolveRelative([folderName, "userNameDataParser.ts"])),
			},
			E.asyncGroup,
			E.unwrapRightOrThrow,
		);

		expect(result.index).toMatchSnapshot();
		expect(result.types).toMatchSnapshot();
		expect(result.userDataParser).toMatchSnapshot();
		expect(result.userIdDataParser).toMatchSnapshot();
		expect(result.userNameDataParser).toMatchSnapshot();
	});
});
