import { hub } from "@core";
import { existsSync, readFileSync, rmSync } from "fs";
import { launchHookServer } from "../../dist/core";
import { codeGeneratorPlugin } from "@duplojs/http/codeGenerator";

describe("codeGenerator", () => {
	const fileName = `${import.meta.dirname}/generateCode.generate.ts`;
	beforeAll(() => {
		if (existsSync(fileName)) {
			rmSync(fileName);
		}
	});

	it("correct generate file", async() => {
		const hubWithPlugins = hub.plug(
			codeGeneratorPlugin({ outputFile: fileName }),
		);
		await launchHookServer(
			hubWithPlugins.aggregatesHooksHubLifeCycle("beforeStartServer"),
			hubWithPlugins,
			{},
		);

		expect(readFileSync(fileName, "utf-8")).toMatchSnapshot();
	});
});
