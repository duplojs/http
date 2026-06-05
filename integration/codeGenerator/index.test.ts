import { hub } from "@core";
import { existsSync, readFileSync, rmSync } from "fs";
import { codeGeneratorPlugin } from "@duplojs/http/codeGenerator";
import { launchHookServer } from "@duplojs/http";
import { execFileSync, execSync } from "child_process";
import { asyncPipe, E, Path } from "@duplojs/utils";
import { SF } from "@duplojs/server-utils";

describe("codeGenerator", () => {
	const fileName = `${import.meta.dirname}/generateCode.generate.ts`;
	const folderName = `${import.meta.dirname}/generateDataParser.generate`;
	const tscPath = require.resolve("typescript/bin/tsc");
	const rootProject = Path.resolveRelative([import.meta.dirname, "../.."]);
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

		execFileSync(
			process.execPath,
			[
				tscPath,
				"-p",
				Path.resolveRelative([rootProject, "integration/codeGenerator/tsconfig.generate.json"]),
			],
			{
				stdio: "inherit",
				cwd: rootProject,
			},
		);

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
