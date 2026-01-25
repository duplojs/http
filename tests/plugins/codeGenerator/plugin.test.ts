import { createHub, launchHookServer, ResponseContract, useRouteBuilder } from "@core";
import { DPE } from "@duplojs/utils";
import { codeGeneratorPlugin } from "@plugin-codeGenerator";
import { testHub } from "@test-utils/hub";
import { type Mock } from "vitest";

vi.mock("node:fs/promises", () => ({
	writeFile: vi.fn(),
}));

const { writeFile } = await import("node:fs/promises");

describe("plugin implementation", () => {
	beforeEach(() => {
		(writeFile as Mock).mockClear();
	});

	const route = useRouteBuilder("GET", "/user")
		.extract({
			headers: {
				header1: DPE.string(),
				header2: DPE.string(),
			},
			body: DPE.object({
				name: DPE.string(),
				age: DPE.number(),
			}),
		})
		.cut(
			ResponseContract.conflict("the-conflict"),
			(__, { response }) => response("the-conflict"),
		)
		.handler(
			ResponseContract.ok("success", DPE.string()),
			(__, { response }) => response("success", ""),
		);

	it("generate API type", async() => {
		const hub = testHub
			.plug(codeGeneratorPlugin({ outputFile: "test.d.ts" }))
			.register(route);

		await launchHookServer(
			hub.aggregatesHooksHubLifeCycle("beforeStartServer"),
			hub,
			{},
		);

		expect((writeFile as Mock).mock.lastCall?.at(0)).toBe("test.d.ts");
		expect((writeFile as Mock).mock.lastCall?.at(1)).toMatchSnapshot();
	});

	it("not generate API type", async() => {
		const hub = testHub
			.plug(codeGeneratorPlugin({ outputFile: "test.d.ts" }));

		await launchHookServer(
			hub.aggregatesHooksHubLifeCycle("beforeStartServer"),
			hub,
			{},
		);

		expect(writeFile).not.toHaveBeenCalled();
	});

	it("not generate in PROD env", async() => {
		const hub = createHub({ environment: "PROD" })
			.plug(codeGeneratorPlugin({ outputFile: "test.d.ts" }))
			.register(route);

		await launchHookServer(
			hub.aggregatesHooksHubLifeCycle("beforeStartServer"),
			hub,
			{},
		);

		expect(writeFile).not.toHaveBeenCalled();
	});
});
