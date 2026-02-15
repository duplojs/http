import { hub } from "@core";
import { existsSync, readFileSync, rmSync } from "fs";
import { codeGeneratorPlugin } from "@duplojs/http/codeGenerator";
import { launchHookServer } from "@duplojs/http";

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
			{} as any,
		);

		expect(readFileSync(fileName, "utf-8")).toMatchSnapshot();
	});
});
