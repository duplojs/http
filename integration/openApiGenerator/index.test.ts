import { hub } from "@core";
import { existsSync, readFileSync, rmSync } from "fs";
import { launchHookServer } from "../../dist/core";
import { openApiGeneratorPlugin } from "@duplojs/http/openApiGenerator";

describe("openApiGenerator", () => {
	const fileName = `${import.meta.dirname}/swagger.generate.json`;
	beforeAll(() => {
		if (existsSync(fileName)) {
			rmSync(fileName);
		}
	});

	it("correct generate file", async() => {
		const hubWithPlugins = hub.plug(
			openApiGeneratorPlugin({ outputFile: fileName }),
		);
		await launchHookServer(
			hubWithPlugins.aggregatesHooksHubLifeCycle("beforeStartServer"),
			hubWithPlugins,
			{},
		);

		expect(readFileSync(fileName, "utf-8")).toMatchSnapshot();
	});
});
