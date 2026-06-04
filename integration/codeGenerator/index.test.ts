import { hub } from "@core";
import { existsSync, readFileSync, rmSync } from "fs";
import { codeGeneratorPlugin } from "@duplojs/http/codeGenerator";
import { launchHookServer } from "@duplojs/http";

describe("codeGenerator", () => {
	const fileName = `${import.meta.dirname}/generateCode.generate.ts`;
	const folderName = `${import.meta.dirname}/generateDataParser.generate`;
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
	});
});
